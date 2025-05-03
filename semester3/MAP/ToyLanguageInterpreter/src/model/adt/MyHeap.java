package model.adt;

import exception.KeyNotFoundException;
import model.value.IValue;

import java.util.HashMap;
import java.util.Map;

public class MyHeap implements MyIHeap {
    private Map<Integer, IValue> hashmap;
    int currAddr;

    public MyHeap(){
        this.hashmap = new HashMap<Integer,IValue>();
        this.currAddr = 1;
    }

    public int allocate(IValue val) {
        this.hashmap.put(currAddr,val);
        this.currAddr+=1;
        return this.currAddr-1;
    }

    public Map<Integer, IValue> getContent() {
        return this.hashmap;
    }

    public void setContent(Map<Integer, IValue> integerIValueMap) {
        this.hashmap = integerIValueMap;
    }

    @Override
    public int getNextFreeAddr() {
        return this.currAddr;
    }

    public IValue getValue(int key) throws KeyNotFoundException {
        if(!containsAddr(key))
            throw new KeyNotFoundException("The key is not in the heap");
        return this.hashmap.get(key);
    }

    public void update(int key, IValue val) throws KeyNotFoundException {
        if(!containsAddr(key))
            throw new KeyNotFoundException("The key is not in the heap");
        this.hashmap.put(key,val);
    }

    public Map<Integer, IValue> getMap() {
        return this.hashmap;
    }

    public void insert(int key, IValue val) {
        this.hashmap.put(key,val);
        this.currAddr+=1;
    }
    public void remove(int key) throws KeyNotFoundException {
        if(!containsAddr(key))
            throw new KeyNotFoundException("The key is not in the heap");
        this.hashmap.remove(key);
    }

    public boolean containsAddr(int key) {
        return this.hashmap.containsKey(key);
    }

    public String toString() {
        StringBuilder st = new StringBuilder();
        this.hashmap.forEach((k,v)->{
            st.append(k).append(" -> ").append(v).append("\n");
        });
        return "Heap contains: " + st.toString();
    }
}
