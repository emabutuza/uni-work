package model.state;

import exception.*;
import model.adt.*;
import model.statement.IStatement;
import model.value.IValue;
import model.value.StringValue;

import java.io.BufferedReader;

public class ProgramState {
    private myIStack<IStatement> execStack;
    private myIMap<String, IValue> symTable;
    private myIList<IValue> outputList;
    private myIMap<StringValue, BufferedReader> fileTable;
    private MyIHeap heap;
    private static int id = 0;

    public static synchronized int getNextId() {
        return ++id;
    }

    private final int programId;

    public ProgramState(IStatement initStatement, myIStack<IStatement> execStack, myIMap<String, IValue> symTable,
                         myIList<IValue> output, myIMap<StringValue, BufferedReader> fileTable, MyIHeap heap) {
        this.execStack = execStack;
        this.symTable = symTable;
        this.outputList = output;
        execStack.push(initStatement);
        this.fileTable = fileTable;
        this.heap = heap;
        this.programId = getNextId();
    }

    public int getProgramId() {
        return programId;
    }

    public Boolean isNotCompleted() {
        return !execStack.isEmpty();
    }

    public ProgramState oneStep() throws MyException, EmptyStackException, StatementException, ExpressionException, KeyNotFoundException {
        if(execStack.isEmpty()) {
            throw new EmptyStackException("The stack is empty!");
        }
        IStatement currentStmt = execStack.pop();
        System.out.println("One Step Current statement: " + currentStmt);
        return currentStmt.execute(this);
    }

    public myIStack<IStatement> getExecStack() {
        return execStack;
    }

    public myIList<IValue> getOutputList() {
        return outputList;
    }

    public myIMap<String, IValue> getSymTable() {
        return symTable;
    }

    public myIMap<StringValue, BufferedReader> getFileTable() {
        return fileTable;
    }

    public String fileTableToString() {
        StringBuilder text = new StringBuilder();
        text.append("File Table: \n");
        for(StringValue key : this.fileTable.getKeys()) {
            text.append(key).append("\n");
        }
        return text.toString();
    }

    public MyIHeap getHeap() {
        return this.heap;
    }

    @Override
    public String toString() {
        return "Program ID" + programId + "\n" + execStack.toString() + "\n" + symTable.toString() + "\n"
                + outputList.toString() + "\n" + fileTableToString() + "\n" + heap.toString() + "\n";
    }

}
