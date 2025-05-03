package gui;

import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.ListView;
import javafx.stage.Stage;
import model.state.ProgramState;
import model.statement.IStatement;
import model.statement.VarDeclStatement;
import model.type.IType;
import model.type.IntType;
import model.type.RefType;
import model.value.IntValue;
import repository.Repository;

import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.Scanner;

import model.adt.*;
import model.state.ProgramState;
import model.statement.*;
import model.expression.*;
import repository.*;
import controller.*;
import view.*;

import java.util.List;

public class Selector {
    @FXML
    private ListView<String> programListView;
    @FXML
    private Button selectProgramButton;

    private List<IStatement> programs; // List of IStmt instances

    public void initialize() {
        programs = loadPrograms();
        programListView.setItems(FXCollections.observableArrayList(
                programs.stream().map(IStatement::toString).toList()
        ));
    }

    // Write the program examples
    private List<IStatement> loadPrograms() {
        /*
        List<IStatement> programExamples = new ArrayList<>();
        IStatement s1 = new VarDeclStatement("v", new IntType());
        IStatement s2 = new VarDeclStatement("a", new RefType(new IntType()));
        IStatement s3 = new AssignStatement("v", new ValueExpression(new IntValue(10)));
        IStatement s4 = new HeapAllocStmt("a", new ValueExpression(new IntValue(22)));
        IStatement s6 = new WriteHeapStmt("a", new ValueExpression(new IntValue(30)));
        IStatement s7 = new AssignStatement("v", new ValueExpression(new IntValue(32)));
        IStatement s8 = new PrintStatement(new VariableExpression("v"));
        IStatement s9 = new PrintStatement(new ReadHeapExp(new VariableExpression("a")));
        IStatement s5 = new CompStatement(s9, new CompStatement(s7, new CompStatement(s8, s6)));
        IStatement s10 = new PrintStatement(new VariableExpression("v"));
        IStatement s11 = new PrintStatement(new ReadHeapExp(new VariableExpression("a")));
        IStatement ex6 = new CompStatement(s1, new CompStatement(s2, new CompStatement(s3, new CompStatement(s4, new CompStatement(new ForkStmt(new CompStatement(new VarDeclStatement("c",new IntType()),s5)), new CompStatement(s10, s11))))));
        myIMap<String, IType> typeEnv = new myMap<String,IType>();
        try {
            ex6.typecheck(typeEnv);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
        System.out.println("Finished typechecking");
        programExamples.add(ex6);
        return programExamples;
        */

        List<IStatement> programExamples = new ArrayList<>();
        IStatement ex = new CompStatement(
                new VarDeclStatement("a", new RefType(new IntType())),
                new CompStatement(
                        new HeapAllocStmt("a", new ValueExpression(new IntValue(20))),
                        new CompStatement(
                                new ForStatement("v", new ValueExpression(new IntValue(0)), new ValueExpression(new IntValue(3)), new ArithmeticalExpression('+', new VariableExpression("v"), new ValueExpression(new IntValue(1))),
                                        new ForkStmt(new CompStatement(new PrintStatement(new VariableExpression("v")), new AssignStatement("v", new ArithmeticalExpression('*', new VariableExpression("v"), new ReadHeapExp(new VariableExpression("a"))))))),
                                new PrintStatement(new ReadHeapExp(new VariableExpression("a")))
                        )
                )
        );

        programExamples.add(ex);
        return programExamples;


    }

    @FXML
    private void handleSelectProgram() {
        int selectedIndex = programListView.getSelectionModel().getSelectedIndex();
        if (selectedIndex >= 0) {
            IStatement selectedProgram = programs.get(selectedIndex);
            Stage currentStage = (Stage) selectProgramButton.getScene().getWindow();
            currentStage.close();

            GUI.launch(selectedProgram);
        }
    }
}