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

import java.io.IOException;

public class CloseRFileStmt implements IStatement {
    IExpression expression;

    public CloseRFileStmt(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public ProgramState execute(ProgramState prgState) throws ExpressionException, StatementException, KeyNotFoundException {
        IValue value = this.expression.evaluate(prgState.getSymTable(), prgState.getHeap());
        if(!value.getType().equals(new StringType()))
            throw new StatementException("The result of the expression is not a StringType");

        StringValue fileName = (StringValue)value;
        if(!prgState.getFileTable().contains(fileName))
            throw new StatementException("The file was not found");

        try{
            prgState.getFileTable().lookup(fileName).close();
            prgState.getFileTable().remove(fileName);
            return null;
        }catch(IOException e){
            throw new StatementException("Problem at closing the BufferedReader");
        }
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        IType type = this.expression.typecheck(typeEnv);
        if(type.equals(new StringType()))
            return typeEnv;
        else
            throw new StatementException("The expression is not a string");
    }

    @Override
    public IStatement deepcopy() {
        return new CloseRFileStmt(this.expression.deepcopy());
    }

    @Override
    public String toString() {
        return "closeRFile(" + this.expression.toString() + ");";
    }
}
