package model.statement;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import exception.StatementException;
import model.adt.myIMap;
import model.adt.myIStack;
import model.expression.IExpression;
import model.expression.RelationalExpression;
import model.expression.VariableExpression;
import model.state.ProgramState;
import model.type.IType;
import model.type.IntType;

public class ForStatement implements IStatement {
    private final IExpression exp1;
    private final IExpression exp2;
    private final IExpression exp3;
    private final IStatement statement;
    private final String varName;

    public ForStatement(String varName, IExpression exp1, IExpression exp2, IExpression exp3, IStatement statement){
        this.varName = varName;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.exp3 = exp3;
        this.statement = statement;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementException, ExpressionException, KeyNotFoundException {
        myIStack<IStatement> stack = state.getExecStack();
        IStatement newStatement = new CompStatement(
                new VarDeclStatement(varName, new IntType()),
                new CompStatement(
                        new AssignStatement(varName, exp1),
                        new WhileStatement(
                                new RelationalExpression(new VariableExpression(varName), "<", exp2),
                                new CompStatement(statement, new AssignStatement(varName, exp3))
                        )
                )
        );
        stack.push(newStatement);
        return null;
    }


    public IStatement deepcopy(){
        return new ForStatement(varName, exp1.deepcopy(), exp2.deepcopy(), exp3.deepcopy(), statement.deepcopy());
    }

    @Override
    public String toString() {
        return "for(" + varName + "=" + exp1 + ";" + varName + "<" + exp2 + ";" + varName + "=" + exp3 +") " + statement;
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        IType type1 = exp1.typecheck(typeEnv);
        IType type2 = exp2.typecheck(typeEnv);
        IType type3 = exp3.typecheck(typeEnv);

        if(type1.equals(new IntType()) && type2.equals(new IntType()) && type3.equals(new IntType())) {
            statement.typecheck(typeEnv.clone());
            return typeEnv;
        } else {
            throw new StatementException("The expressions of the for statement must be of type int!");
        }
    }
}
