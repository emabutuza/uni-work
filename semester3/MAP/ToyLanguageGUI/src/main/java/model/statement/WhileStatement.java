package model.statement;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import exception.StatementException;
import model.adt.myIMap;
import model.expression.IExpression;
import model.state.ProgramState;
import model.type.BoolType;
import model.type.IType;
import model.value.BoolValue;

public class WhileStatement implements  IStatement {
    private IExpression cond;
    private IStatement stmt;

    public WhileStatement(IExpression cond, IStatement stmt) {
        this.cond = cond;
        this.stmt = stmt;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementException, ExpressionException, KeyNotFoundException {
        if(cond.evaluate(state.getSymTable(), state.getHeap()).getType().toString().equals("bool")) {
            if(cond.evaluate(state.getSymTable(), state.getHeap()).equals(new BoolValue(true))) {
                state.getExecStack().push(this);
                state.getExecStack().push(stmt);
            }
        }
        else
            throw new StatementException("Condition is not a boolean");

        return null;
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        IType condType = cond.typecheck(typeEnv);
        if(condType.equals(new BoolType()))
            return typeEnv;
        else
            throw new StatementException("Condition is not a boolean");
    }

    @Override
    public IStatement deepcopy() {
        return null;
    }

    public String toString() {
        return "while(" + cond.toString() + "){" + stmt.toString() + "}";
    }
}
