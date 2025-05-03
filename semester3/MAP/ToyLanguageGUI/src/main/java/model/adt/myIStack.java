package model.adt;

import exception.EmptyStackException;

import java.util.List;

public interface myIStack<T> {
    T pop() throws EmptyStackException;
    void push(T obj);
    boolean isEmpty();
    int size();
    public List<T> getContentAsList();
}
