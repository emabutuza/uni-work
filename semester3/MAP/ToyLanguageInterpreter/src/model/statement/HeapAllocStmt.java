package model.statement;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import exception.StatementException;
import model.adt.MyIHeap;
import model.adt.myIMap;
import model.expression.IExpression;
import model.state.ProgramState;
import model.type.IType;
import model.type.RefType;
import model.value.IValue;
import model.value.RefValue;

public class HeapAllocStmt implements IStatement {
    String var;
    IExpression expr;

    public HeapAllocStmt(String var, IExpression expr) {
        this.var = var;
        this.expr = expr;
    }

    @Override
    public ProgramState execute(ProgramState prgState) throws StatementException, KeyNotFoundException, ExpressionException {
        myIMap<String, IValue> symTable = prgState.getSymTable();
        IValue evalExpr = expr.evaluate(symTable, prgState.getHeap());

        if (!symTable.contains(var)) {
            throw new StatementException("Variable name is not in the SymTable.");
        }

        IValue variableValue = symTable.lookup(var);


        if (!(variableValue instanceof RefValue)) {
            throw new StatementException("Variable must be RefType");
        }

        RefValue refValue = (RefValue) variableValue;
        if (!refValue.getLocationType().equals(evalExpr.getType())) {
            throw new StatementException("Wrong type");
        }

        MyIHeap heap = prgState.getHeap();
        int addr = heap.getNextFreeAddr();
        heap.insert(addr, evalExpr);
        symTable.update(var, new RefValue(addr, evalExpr.getType()));

        return null;
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        IType typeVar = typeEnv.lookup(var);
        IType typeExpr = expr.typecheck(typeEnv);

        if (typeVar.equals(new RefType(typeExpr))) {
            return typeEnv;
        } else {
            throw new StatementException("HeapAllocStmt: right hand side and left hand side have different types");
        }
    }


    @Override
    public IStatement deepcopy() {
        return new HeapAllocStmt(var, expr);
    }

    public String toString(){
        return "new(" + var + ", " + expr.toString() + ")";
    }
}
