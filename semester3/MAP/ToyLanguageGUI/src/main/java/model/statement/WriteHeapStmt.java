package model.statement;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import exception.StatementException;
import exception.TypeException;
import model.adt.MyIHeap;
import model.adt.myIMap;
import model.expression.IExpression;
import model.state.ProgramState;
import model.type.IType;
import model.type.RefType;
import model.value.IValue;
import model.value.RefValue;

public class WriteHeapStmt implements IStatement {
    private String varName;
    private IExpression exp;

    public WriteHeapStmt(String var_name, IExpression exp) {
        this.varName = var_name;
        this.exp = exp;
    }

    public ProgramState execute(ProgramState state) throws KeyNotFoundException, ExpressionException {
        myIMap<String, IValue> symTable = state.getSymTable();
        MyIHeap heap = state.getHeap();
        if(!symTable.contains(varName))
            throw new KeyNotFoundException("Variable not found in symbol table");

        IValue value = symTable.lookup(varName);
        System.out.println(varName);
        if(!(value instanceof RefValue)) {
            System.out.println(value);
            throw new TypeException("Variable is not a ref value");
        }

        RefValue refValue = (RefValue) value;
        if(!heap.containsAddr(refValue.getAddr()))
            throw new KeyNotFoundException("Address not found in heap");

        IValue expValue = exp.evaluate(symTable, heap);
        if(!expValue.getType().equals(refValue.getLocationType()))
            throw new TypeException("Types do not match");
        heap.update(refValue.getAddr(), expValue);
        return null;
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        IType typeVar = typeEnv.lookup(varName);
        IType typeExp = exp.typecheck(typeEnv);
        if(typeVar.equals(new RefType(typeExp)))
            return typeEnv;
        else
            throw new TypeException("WriteHeap: right hand side and left hand side have different types");
    }

    @Override
    public IStatement deepcopy() {
        return new WriteHeapStmt(varName, exp.deepcopy());
    }


    public String toString() {
        return "WriteHeap(" + varName + "," + exp.toString() + ")";
    }
}
