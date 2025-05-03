package controller;

import exception.*;
import model.adt.myIStack;
import model.state.ProgramState;
import model.statement.IStatement;
import model.value.IValue;
import model.value.RefValue;
import repository.IRepo;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

public class Controller {
    private IRepo repository;
    public ExecutorService executor;
    public Controller(IRepo repository) {
        this.repository = repository;
    }

    Map<Integer, IValue> GarbageCollector(List<Integer> symTableAddr, Map<Integer,IValue> heap){
        List <Integer> heapAddr = getAddrFromHeap(heap, symTableAddr);
        return heap.entrySet().stream()
                .filter(e->heapAddr.contains(e.getKey()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    List<Integer> getAddrFromSymTable(Collection<IValue> symTableValues){
        return symTableValues.stream()
                .filter(v-> v instanceof RefValue)
                .map(v-> {
                    RefValue v1 = (RefValue)v;
                    return v1.getAddr();
                })
                .collect(Collectors.toList());
    }

    // Recursively collects addresses referenced in the heap
    List<Integer> getAddrFromHeap(Map<Integer, IValue> heap, List<Integer> symTableAddr) {
        List<Integer> addresses = symTableAddr;
        boolean added;

        do {
            added = false;
            // Collect new addresses referenced by RefValues in the current heap
            List<Integer> newAddresses = heap.entrySet().stream()
                    .filter(e -> addresses.contains(e.getKey())) // Only check reachable addresses
                    .map(Map.Entry::getValue)
                    .filter(v -> v instanceof RefValue)
                    .map(v -> ((RefValue) v).getAddr())
                    .filter(addr -> !addresses.contains(addr)) // Avoid duplicates
                    .collect(Collectors.toList());

            if (!newAddresses.isEmpty()) {
                addresses.addAll(newAddresses);
                added = true; // Continue if new addresses are added
            }
        } while (added);

        return addresses;
    }

    public List<ProgramState> removeCompletedPrg(List<ProgramState> inPrgList){
        return inPrgList.stream()
                .filter(p->p.isNotCompleted())
                .collect(Collectors.toList());
    }

    public void oneStepForAllPrg(List<ProgramState> prgList) throws InterruptedException {
        prgList.forEach(prg->repository.logPrgStateExec(prg));
        List<Callable<ProgramState>> callList = prgList.stream().
                map((ProgramState p)->(Callable<ProgramState>)(() -> {return p.oneStep();})).
                collect(Collectors.toList());

        List<ProgramState> newPrgList = executor.invokeAll(callList).stream()
                .map(future -> {try{return future.get();}
                catch (ExecutionException e) {
                    throw new RuntimeException(e);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                })
                .filter(p-> p!=null)
                .collect(Collectors.toList());
        prgList.addAll(newPrgList);
        prgList.forEach(prg->repository.logPrgStateExec(prg));
        System.out.println("After one step");
        prgList.forEach(prg->displayPrgState(prg));
        repository.setPrgList(prgList);

    }

    public Map<Integer, IValue> conservativeGarbageCollector(List<ProgramState> prgStates){
        // collect all addr from the sym tables of all prg states
        List<Integer> symTableAddr = prgStates.stream()
                .flatMap(p->getAddrFromSymTable(p.getSymTable().getContent().values()).stream())
                .collect(Collectors.toList());

        // get a ref to the shared heap
        Map<Integer, IValue> heap = prgStates.getFirst().getHeap().getContent();

        // Collect reachable addresses from the heap
        List<Integer> reachableHeapAdresses = getAddrFromHeap(heap, symTableAddr);

        return heap.entrySet().stream()
                .filter(entry -> reachableHeapAdresses.contains(entry.getKey()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

    }

    public void allStep() throws MyException, InterruptedException {
        executor = Executors.newFixedThreadPool(2);
        List<ProgramState> prgList = removeCompletedPrg(repository.getPrgList());
        while(prgList.size() > 0){
            // Call conservative garbage collector
            Map<Integer, IValue> heap = conservativeGarbageCollector(prgList);
            oneStepForAllPrg(prgList);
            prgList = removeCompletedPrg(repository.getPrgList());
        }
        executor.shutdownNow();
        repository.setPrgList(prgList);
    }

    public void displayPrgState(ProgramState program) {
        System.out.println(program);
    }

    public IRepo getRepository() {
        return repository;
    }
}