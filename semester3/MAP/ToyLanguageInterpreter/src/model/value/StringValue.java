package model.value;

import model.type.IType;
import model.type.IntType;
import model.type.StringType;

public class StringValue implements IValue{
    private String value;

    public StringValue(String val){
        this.value = val;
    }

    public String getValue() {
        return value;
    }

    public IType getType() {
        return new StringType();
    }

    @Override
    public boolean equals(IValue object) {
        return object.getType() instanceof StringType && ((StringValue) object).getValue() == this.getValue();
    }

    public IValue deepcopy(){
        return new StringValue(value);
    }

    public String toString() {
        return value;
    }
}
