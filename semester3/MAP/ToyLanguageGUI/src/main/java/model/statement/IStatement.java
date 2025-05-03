package model.statement;
import exception.ExpressionException;
import exception.KeyNotFoundException;
import model.adt.myIMap;
import model.state.ProgramState;
import exception.StatementException;
import model.type.IType;

public interface IStatement {
    ProgramState execute(ProgramState state) throws StatementException, ExpressionException, KeyNotFoundException;
    IStatement deepcopy();
    myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException;
}
