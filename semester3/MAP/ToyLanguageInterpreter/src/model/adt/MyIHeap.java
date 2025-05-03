package model.adt;

import exception.KeyNotFoundException;
import model.value.IValue;

import java.util.Map;

public interface MyIHeap {
    public int allocate(IValue val);
    public IValue getValue(int key) throws KeyNotFoundException;
    public void insert(int key, IValue val);
    public void update(int key, IValue val) throws KeyNotFoundException;
    public Map<Integer,IValue> getMap();
    public boolean containsAddr(int key);
    public void remove(int key) throws KeyNotFoundException;

    Map<Integer, IValue> getContent();

    void setContent(Map<Integer, IValue> integerIValueMap);

    int getNextFreeAddr();
}
