package model.statement;

import exception.ExpressionException;
import exception.StatementException;
import model.adt.myIMap;
import model.state.ProgramState;
import model.type.IType;

public class CompStatement implements IStatement {
    private IStatement first;
    private IStatement second;

    public CompStatement(IStatement first, IStatement second) {
        this.first = first;
        this.second = second;
    }

    public ProgramState execute(ProgramState state) {
        state.getExecStack().push(second);
        state.getExecStack().push(first);
        return null;
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        return second.typecheck(first.typecheck(typeEnv));
    }

    public IStatement deepcopy(){
        return new CompStatement(first.deepcopy(),second.deepcopy());
    }

    public String toString() {
        return first.toString() + ";" + second.toString();
    }
}
