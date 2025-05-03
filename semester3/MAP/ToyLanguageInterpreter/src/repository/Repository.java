package repository;

import exception.RepoException;
import model.state.ProgramState;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class Repository implements IRepo {
    private List<ProgramState> programStateList;
    private String logFilePath;
    private int CrtPrgIndex;

    public Repository(String logFilePath) {
        this.programStateList = new ArrayList<>();
        this.CrtPrgIndex = 0;
        this.logFilePath = logFilePath;
    }

    public Repository(ProgramState initState, String logFilePath) {
        this.programStateList = new ArrayList<>();
        this.programStateList.add(initState);
        this.CrtPrgIndex = 0;
        this.logFilePath = logFilePath;
    }

    public void setPrgList(List <ProgramState> newPrgStates){
        this.programStateList = newPrgStates;
    }

    @Override
    public List<ProgramState> getPrgList() {
        return this.programStateList;
    }

    public void addProgramState(ProgramState state) {
        programStateList.add(state);
        this.CrtPrgIndex++;
    }

    public void removePrgState() {
        programStateList.removeFirst();
    }

    public void logPrgStateExec(ProgramState state) {
        try {
            PrintWriter logFile = new PrintWriter(new BufferedWriter(new FileWriter(this.logFilePath, true)));
            logFile.println(state.toString());
            logFile.println("-------------------------");
            logFile.close();
        } catch(IOException err) {
            throw new RepoException("File does not exist!");
        }

    }
}
