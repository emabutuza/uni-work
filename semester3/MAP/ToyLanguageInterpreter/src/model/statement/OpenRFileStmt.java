package model.statement;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import exception.StatementException;
import model.adt.myIMap;
import model.expression.IExpression;
import model.state.ProgramState;
import model.type.IType;
import model.type.StringType;
import model.value.IValue;
import model.value.StringValue;

import java.io.*;

public class OpenRFileStmt implements IStatement{
    IExpression expression;

    public OpenRFileStmt(IExpression expression) {
        this.expression = expression;
    }

    public ProgramState execute(ProgramState prgState) throws ExpressionException, StatementException, KeyNotFoundException {
        IValue val = expression.evaluate(prgState.getSymTable(), prgState.getHeap());
        if(!val.getType().equals(new StringType()))
            throw new StatementException("The expression is not a string!");

        StringValue fileName = (StringValue) val;
        if(prgState.getFileTable().contains(fileName))
            throw new StatementException("The file is already open!");

        try{
            BufferedReader reader = new BufferedReader(new FileReader(fileName.getValue()));
            prgState.getFileTable().insert(fileName, reader);
            return null;
        } catch(IOException e) {
            throw new StatementException("Problem at opening the file");
        }
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        IType type = expression.typecheck(typeEnv);
        if(type.equals(new StringType()))
            return typeEnv;
        else
            throw new StatementException("The expression is not a string");
    }


    @Override
    public IStatement deepcopy() {
        return new OpenRFileStmt(expression.deepcopy());
    }

    public String toString() {
        return "openRFile(" + expression.toString() + ")";
    }
}
