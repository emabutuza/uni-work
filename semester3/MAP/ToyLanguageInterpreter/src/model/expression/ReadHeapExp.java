package model.expression;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import model.adt.MyIHeap;
import model.adt.myIMap;
import model.type.IType;
import model.type.RefType;
import model.value.IValue;
import model.value.RefValue;

public class ReadHeapExp implements IExpression {
    IExpression expression;

    public ReadHeapExp(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public IValue evaluate(myIMap<String, IValue> symTbl, MyIHeap heap) throws ExpressionException, KeyNotFoundException {
        IValue res = expression.evaluate(symTbl, heap);
        if(res instanceof RefValue refValue){
            int address = refValue.getAddr();
            if(heap.containsAddr(address)){
                return heap.getValue(address);
            }
            else{
                throw new ExpressionException("Address not defined in heap");
            }
        }
        else{
            throw new ExpressionException("Expression is not a reference");
        }
    }

    @Override
    public IType typecheck(myIMap<String, IType> typeEnv) throws ExpressionException {
        IType type = expression.typecheck(typeEnv);
        if(type instanceof RefType){
            RefType refType = (RefType) type;
            return refType.getInner();
        }
        else{
            throw new ExpressionException("Expression is not a reference");
        }
    }

    public String toString() {
        return "ReadHeap(" + expression.toString() + ")";
    }

    @Override
    public IExpression deepcopy() {
        return null;
    }
}
