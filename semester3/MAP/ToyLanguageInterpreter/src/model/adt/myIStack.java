package model.adt;

import exception.EmptyStackException;

public interface myIStack<T> {
    T pop() throws EmptyStackException;
    void push(T obj);
    boolean isEmpty();
    int size();
}
