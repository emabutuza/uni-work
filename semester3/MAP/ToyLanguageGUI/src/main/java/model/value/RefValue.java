package model.value;

import model.type.IType;
import model.type.RefType;

public class RefValue implements IValue{
    int address;
    IType locationType;

    public RefValue(int addr, IType locType){
        this.address = addr;
        this.locationType = locType;
    }

    public int getAddr() {
        return address;
    }

    public IType getType(){
        return new RefType(locationType);
    }

    @Override
    public boolean equals(IValue value) {
        if(value.getType() instanceof RefType){
            return ((RefValue) value).getLocationType().equals(locationType);
        }
        return false;
    }

    public IType getLocationType() {
        return locationType;
    }

    public String toString(){
        return "(" + address + ", " + locationType.toString() + ")";
    }

    @Override
    public IValue deepcopy() {
        return new RefValue(address, locationType.deepcopy());
    }
}
