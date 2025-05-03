package repository;

import exception.MyException;
import model.state.ProgramState;

import java.util.List;

public interface IRepo {
    List<ProgramState> getPrgList();
    void setPrgList(List<ProgramState> programStateList);
    void addProgramState(ProgramState state);
    void removePrgState();
    void logPrgStateExec(ProgramState prgState) throws MyException;
}
