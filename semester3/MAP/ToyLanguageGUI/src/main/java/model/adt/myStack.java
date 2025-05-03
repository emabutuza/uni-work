package model.adt;

import exception.EmptyStackException;

import java.util.List;
import java.util.Stack;

public class myStack<T> implements myIStack<T> {
    Stack<T> stack;
    public myStack() {
        stack = new Stack<>();
    }

    @Override
    public T pop() throws EmptyStackException {
        if(stack.isEmpty())
            throw new EmptyStackException("Stack is empty!\n");
        else
            return this.stack.pop();
    }

    @Override
    public void push(T element){
        this.stack.push(element);
    }

    @Override
    public boolean isEmpty() {
        return this.stack.isEmpty();
    }

    @Override
    public int size() {
        return this.stack.size();
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder();
        for (int i = this.stack.size() - 1; i >= 0; i--) {
            str.append(this.stack.elementAt(i));
            str.append("\n");
        }
        return "Stack contains: \n" + str.toString();
    }

    @Override
    public List<T> getContentAsList() {
        return this.stack;
    }
}
