import controller.Controller;
import model.adt.*;
import model.expression.ValueExpression;
import model.expression.VariableExpression;
import model.expression.*;
import model.state.ProgramState;
import model.statement.*;
import model.type.*;
import model.value.BoolValue;
import model.value.IValue;
import model.value.IntValue;
import model.value.StringValue;
import repository.IRepo;
import repository.Repository;
import view.TextMenu;
import view.commands.ExitCommand;
import view.commands.RunExample;

import java.io.BufferedReader;
import java.util.Scanner;

public class Interpreter {
    public static void main(String[] args) {
         System.out.println("Enter the path: \n");
        // System.out.println("Filename for log hardcoded to log.txt");
        String logFilePath;
        Scanner scanner1 = new Scanner(System.in);
        logFilePath = scanner1.next();
        // logFilePath = "log.txt";

        /*

        IStatement ex1= new CompStatement(new VarDeclStatement("v",new IntType()),
                new CompStatement(new AssignStatement("v",new ValueExpression(new IntValue(2))), new PrintStatement(new
                        VariableExpression("v"))));
        myStack<IStatement> st = new myStack<>();
        myMap<String, IValue> sym = new myMap<>();
        myMap<StringValue, BufferedReader> fileTable = new myMap<>();
        MyHeap heap1 = new MyHeap();
        ProgramState prg1 = new ProgramState(ex1, st, sym, new myList<IValue>(),fileTable, heap1);

        IRepo repo1 = new Repository(prg1,path);
        Controller ctr1 = new Controller(repo1);

        IStatement ex2 = new CompStatement( new VarDeclStatement("a",new IntType()),
                new CompStatement(new VarDeclStatement("b",new IntType()),
                        new CompStatement(new AssignStatement("a", new ArithmeticalExpression('+',new ValueExpression(new IntValue(2)),new
                                ArithmeticalExpression('*',new ValueExpression(new IntValue(3)), new ValueExpression(new IntValue(5))))),
                                new CompStatement(new AssignStatement("b",new ArithmeticalExpression('+',new VariableExpression("a"), new ValueExpression(new
                                        IntValue(1)))), new PrintStatement(new VariableExpression("b"))))));

        myStack<IStatement> st2 = new myStack<>();
        myMap<String, IValue> sym2 = new myMap<>();
        myMap<StringValue, BufferedReader> fileTable2 = new myMap<>();
        MyHeap heap2 = new MyHeap();
        ProgramState prg2 = new ProgramState(ex2, st2, sym2,new myList<IValue>(),fileTable2, heap2);


        IRepo repo2 = new Repository(prg2,path);
        Controller ctr2 = new Controller(repo2);


        IStatement ex3 = new CompStatement(new VarDeclStatement("a",new BoolType()),
                new CompStatement(new VarDeclStatement("v", new IntType()),
                        new CompStatement(new AssignStatement("a", new ValueExpression(new BoolValue(false))),
                                new CompStatement(new IfStatement(new VariableExpression("a"),new AssignStatement("v",new ValueExpression(new
                                        IntValue(2))), new AssignStatement("v", new ValueExpression(new IntValue(3)))), new PrintStatement(new
                                        VariableExpression("v"))))));

        myStack<IStatement> st3 = new myStack<IStatement>();
        myMap<String, IValue> sym3 = new myMap<>();
        myMap<StringValue, BufferedReader> fileTable3 = new myMap<>();
        MyHeap heap3 = new MyHeap();
        ProgramState prg3 = new ProgramState(ex3, st3, sym3,new myList<IValue>(),fileTable3, heap3);

        IRepo repo3 = new Repository(prg3,path);
        Controller ctr3 = new Controller(repo3);


        IStatement ex5 = new CompStatement(new VarDeclStatement("a", new IntType()),
                        new CompStatement(new AssignStatement("a", new ArithmeticalExpression('/',
                                new ValueExpression(new IntValue(50)), new ValueExpression(new IntValue(0)))),
                                new PrintStatement(new VariableExpression("a"))));

        myStack<IStatement> st5 = new myStack<IStatement>();
        myMap<String, IValue> sym5 = new myMap<>();
        myMap<StringValue, BufferedReader> fileTable5 = new myMap<>();
        MyHeap heap5 = new MyHeap();
        ProgramState prg5 = new ProgramState(ex5, st5, sym5, new myList<IValue>(), fileTable5, heap5);
        IRepo repo5 = new Repository(prg5, path);
        Controller ctr5 = new Controller(repo5);


        IStatement ex6 = new CompStatement(new VarDeclStatement("a",new IntType()),new CompStatement(new VarDeclStatement("b",new IntType()),new CompStatement (new AssignStatement("a",new ValueExpression(new IntValue(2))),
                new CompStatement(new AssignStatement("b",new ValueExpression(new IntValue(3))),new CompStatement(new IfStatement(new RelationalExpression(new VariableExpression("a"),"<",new VariableExpression("b")),
                        new AssignStatement("a",new ValueExpression(new IntValue(3))),new AssignStatement("b",new ValueExpression(new IntValue(4))))
                        ,new CompStatement(new PrintStatement(new VariableExpression("a")),new PrintStatement(new VariableExpression("b"))))))));


        myStack<IStatement> st6 = new myStack<IStatement>();
        myMap<String, IValue> sym6 = new myMap<>();
        myMap<StringValue, BufferedReader> fileTable6 = new myMap<>();
        MyHeap heap6 = new MyHeap();
        ProgramState prg6 = new ProgramState(ex6, st6, sym6, new myList<IValue>(),fileTable6, heap6);

        IRepo repo6 = new Repository(prg6,path);
        Controller ctr6 = new Controller(repo6);



        CloseRFileStmt st49 = new CloseRFileStmt(new VariableExpression("varf"));
        CompStatement st48 = new CompStatement(new PrintStatement(new VariableExpression("varc")), st49);
        CompStatement st47 = new CompStatement(new ReadFileStmt(new VariableExpression("varf"), "varc"), st48);
        CompStatement st46 = new CompStatement(new PrintStatement(new VariableExpression("varc")), st47);
        CompStatement st45 = new CompStatement(new ReadFileStmt(new VariableExpression("varf"), "varc"), st46);
        CompStatement st44 = new CompStatement(new VarDeclStatement("varc", new IntType()), st45);
        CompStatement st43 = new CompStatement(new OpenRFileStmt(new VariableExpression("varf")), st44);
        CompStatement st42 = new CompStatement(new AssignStatement("varf", new ValueExpression(new StringValue("test.in"))), st43);
        IStatement st4 = new CompStatement(new VarDeclStatement("varf", new StringType()), st42);
        MyHeap heap4 = new MyHeap();
        ProgramState prg4 = new ProgramState(st4, new myStack<IStatement>(), new myMap<>(), new myList<IValue>(), new myMap<StringValue, BufferedReader>(), heap4);

        IRepo repo4 = new Repository(prg4,path);
        Controller ctr4 = new Controller(repo4);

        TextMenu menu = new TextMenu();
        menu.addCommand(new ExitCommand("0", "exit"));
        menu.addCommand(new RunExample("1",ex1.toString(),ctr1));
        menu.addCommand(new RunExample("2",ex2.toString(),ctr2));
        menu.addCommand(new RunExample("3",ex3.toString(),ctr3));
        menu.addCommand(new RunExample("4",st4.toString(),ctr4));
        menu.addCommand(new RunExample("5",ex5.toString(),ctr5));
        menu.addCommand(new RunExample("6",ex6.toString(),ctr6));
        menu.show();

        */


        /*
        // Example 1: test new heap memory
        // Ref int v; new(v,20); Ref Ref int a; new(a,v); print(v); print(a);
        VarDeclStatement varDeclStmt1 = new VarDeclStatement("v", new RefType(new IntType()));
        HeapAllocStmt allocStmt1 = new HeapAllocStmt("v", new ValueExpression(new IntValue(20)));
        VarDeclStatement varDeclStmt2 = new VarDeclStatement("a", new RefType(new RefType(new IntType())));
        HeapAllocStmt allocStmt2 = new HeapAllocStmt("a", new VariableExpression("v"));
        PrintStatement printStmt1 = new PrintStatement(new VariableExpression("v"));
        PrintStatement printStmt2 = new PrintStatement(new VariableExpression("a"));

        IStatement ex1 = new CompStatement(varDeclStmt1,
                new CompStatement(allocStmt1,
                        new CompStatement(varDeclStmt2,
                                new CompStatement(allocStmt2,
                                        new CompStatement(printStmt1, printStmt2)))));
        ProgramState prgState1 = new ProgramState(ex1,new myStack<IStatement>(), new myMap<String, IValue>(), new myList<IValue>(),  new myMap<StringValue, BufferedReader>(), new MyHeap());
        IRepo repository1 = new Repository(prgState1, logFilePath);
        Controller ctr1 = new Controller(repository1);

        // Example 2: test read heap
        // Ref int v; new(v,20); Ref Ref int a; new(a,v); print(rH(v)); print(rH(rH(a)) + 5);
        VarDeclStatement varDeclStmt3 = new VarDeclStatement("v", new RefType(new IntType()));
        HeapAllocStmt allocStmt3 = new HeapAllocStmt("v", new ValueExpression(new IntValue(20)));
        VarDeclStatement varDeclStmt4 = new VarDeclStatement("a", new RefType(new RefType(new IntType())));
        HeapAllocStmt allocStmt4 = new HeapAllocStmt("a", new VariableExpression("v"));
        PrintStatement printStmt3 = new PrintStatement(new ReadHeapExp(new VariableExpression("v")));
        PrintStatement printStmt4 = new PrintStatement(
                new ArithmeticalExpression('+',new ReadHeapExp(new ReadHeapExp(new VariableExpression("a"))), new ValueExpression(new IntValue(5))));

        IStatement ex2 = new CompStatement(varDeclStmt3,
                new CompStatement(allocStmt3,
                        new CompStatement(varDeclStmt4,
                                new CompStatement(allocStmt4,
                                        new CompStatement(printStmt3, printStmt4)))));

        ProgramState prgState2 = new ProgramState(ex2,new myStack<IStatement>(), new myMap<String, IValue>(), new myList<IValue>(),  new myMap<StringValue, BufferedReader>(), new MyHeap());
        IRepo repository2 = new Repository(prgState2, logFilePath);
        Controller ctr2 = new Controller(repository2);

        // Example 3: test write heap
        // Ref int v; new(v,20); print(rH(v)); wH(v,30); print(rH(v) + 5);

        VarDeclStatement varDeclStmt5 = new VarDeclStatement("v", new RefType(new IntType()));
        HeapAllocStmt allocStmt5 = new HeapAllocStmt("v", new ValueExpression(new IntValue(20)));
        PrintStatement printStmt5 = new PrintStatement(new ReadHeapExp(new VariableExpression("v")));
        WriteHeapStmt writeHeap1 = new WriteHeapStmt("v", new ValueExpression(new IntValue(30)));
        PrintStatement printStmt6 = new PrintStatement(
                new ArithmeticalExpression('+',new ReadHeapExp(new VariableExpression("v")), new ValueExpression(new IntValue(5))));
        IStatement ex3 = new CompStatement(varDeclStmt5,
                new CompStatement(allocStmt5,
                        new CompStatement(printStmt5,
                                new CompStatement(writeHeap1, printStmt6))));
        ProgramState prgState3 = new ProgramState(ex3,new myStack<IStatement>(), new myMap<String, IValue>(), new myList<IValue>(),  new myMap<StringValue, BufferedReader>(), new MyHeap());
        IRepo repository3 = new Repository(prgState3, logFilePath);
        Controller ctr3 = new Controller(repository3);

        // Example 4: test garbage collector
        // Ref int v;new(v,30);new(v,20);Ref Ref int a; new(a,v); new(v,30);print(rH(rH(a)));
        VarDeclStatement varDeclStmt6 = new VarDeclStatement("v", new RefType(new IntType()));
        HeapAllocStmt allocStmt6 = new HeapAllocStmt("v", new ValueExpression(new IntValue(20)));
        HeapAllocStmt allocStmt9 = new HeapAllocStmt("v", new ValueExpression(new IntValue(30)));
        VarDeclStatement varDeclStmt7 = new VarDeclStatement("a", new RefType(new RefType(new IntType())));
        HeapAllocStmt allocStmt7 = new HeapAllocStmt("a", new VariableExpression("v"));
        HeapAllocStmt allocStmt8 = new HeapAllocStmt("v", new ValueExpression(new IntValue(30)));
        PrintStatement printStmt7 = new PrintStatement(new ReadHeapExp(new ReadHeapExp(new VariableExpression("a"))));
        IStatement ex4 = new CompStatement(varDeclStmt6,
                new CompStatement(allocStmt9,
                        new CompStatement(allocStmt6,
                                new CompStatement(varDeclStmt7,
                                        new CompStatement(allocStmt7,
                                                new CompStatement(allocStmt8, printStmt7))))));
        ProgramState prgState4 = new ProgramState( ex4,new myStack<IStatement>(), new myMap<String, IValue>(), new myList<IValue>(), new myMap<StringValue, BufferedReader>(), new MyHeap());
        IRepo repository4 = new Repository(prgState4, logFilePath);
        Controller ctr4 = new Controller(repository4);


        // Example 5: test while statement
        // int v; v=4; (while (v>0) print(v);v=v-1);print(v)
        VarDeclStatement varDeclStmt8 = new VarDeclStatement("v", new IntType());
        AssignStatement assignStmt1 = new AssignStatement("v", new ValueExpression(new IntValue(4)));
        PrintStatement printStmt8 = new PrintStatement(new VariableExpression("v"));
        PrintStatement printStmt9 = new PrintStatement(new VariableExpression("v"));
        RelationalExpression relationalExp1 = new RelationalExpression(new VariableExpression("v"), ">", new ValueExpression(new IntValue(0)));
        ArithmeticalExpression arithExp1 = new ArithmeticalExpression('-',new VariableExpression("v"), new ValueExpression(new IntValue(1)));
        AssignStatement assignStmt2 = new AssignStatement("v", arithExp1);
        WhileStatement whileStmt1 = new WhileStatement(relationalExp1, new CompStatement(printStmt8, assignStmt2));
        IStatement ex5 = new CompStatement(varDeclStmt8,
                new CompStatement(assignStmt1,
                        new CompStatement(whileStmt1, printStmt9)));
        ProgramState prgState5 = new ProgramState(ex5,new myStack<IStatement>(), new myMap<String, IValue>(), new myList<IValue>(),  new myMap<StringValue, BufferedReader>(), new MyHeap());
        IRepo repository5 = new Repository(prgState5, logFilePath);
        Controller ctr5 = new Controller(repository5);
        */



        /*
        Example:
           int v; Ref int a; v=10;new(a,22);
           fork(wH(a,30);v=32;print(v);print(rH(a)));
           print(v);print(rH(a))

         */
        TextMenu menu = new TextMenu();
        menu.addCommand(new ExitCommand("0", "exit"));


        IStatement s1 = new VarDeclStatement("v", new IntType());
        IStatement s2 = new VarDeclStatement("a", new RefType(new IntType()));
        // IStatement s2 = new VarDeclStatement("a", new RefType(new StringType()));
        IStatement s3 = new AssignStatement("v", new ValueExpression(new IntValue(10)));
        IStatement s4 = new HeapAllocStmt("a", new ValueExpression(new IntValue(22)));
        IStatement s6 = new WriteHeapStmt("a", new ValueExpression(new IntValue(30)));
        IStatement s7 = new AssignStatement("v", new ValueExpression(new IntValue(32)));
        IStatement s8 = new PrintStatement(new VariableExpression("v"));
        IStatement s9 = new PrintStatement(new ReadHeapExp(new VariableExpression("a")));
        IStatement s5 = new CompStatement(s6, new CompStatement(s7, new CompStatement(s8, s9)));
        IStatement s10 = new PrintStatement(new VariableExpression("v"));
        IStatement s11 = new PrintStatement(new ReadHeapExp(new VariableExpression("a")));
        IStatement ex6 = new CompStatement(s1, new CompStatement(s2, new CompStatement(s3, new CompStatement(s4, new CompStatement(new ForkStmt(s5), new CompStatement(s10, s11))))));

        myIMap<String, IType> typeEnv6 = new myMap<>();
        try {
            ex6.typecheck(typeEnv6);
            ProgramState prgState6 = new ProgramState(ex6, new myStack<>(), new myMap<>(), new myList<>(), new myMap<>(), new MyHeap());
            IRepo repository6 = new Repository(prgState6, logFilePath);
            Controller ctr6 = new Controller(repository6);
            menu.addCommand(new RunExample("1", ex6.toString(), ctr6));
        } catch (Exception e) {
            System.out.println("Typecheck error for example 1: " + e.getMessage());
        }

        /*
        ProgramState prgState6 = new ProgramState(ex6,new myStack<IStatement>(), new myMap<String, IValue>(), new myList<IValue>(),  new myMap<StringValue, BufferedReader>(), new MyHeap());
        IRepo repository6 = new Repository(prgState6, logFilePath);
        Controller ctr6 = new Controller(repository6);
         */

        /*
        Example:
            Ref(int) a;
            int v;
            new(a, 10);
            fork(v=20; fork(wH(a, 40); print(rH(a));); print(v);)
            v=30;
            print(v);
            print(rH(a));
        */

        IStatement s12 = new VarDeclStatement("a", new RefType(new IntType()));
        IStatement s13 = new VarDeclStatement("v", new IntType());
        IStatement s14 = new HeapAllocStmt("a", new ValueExpression(new IntValue(10)));
        IStatement s15 = new AssignStatement("v", new ValueExpression(new IntValue(20)));
        IStatement s16 = new WriteHeapStmt("a", new ValueExpression(new IntValue(40)));
        IStatement s17 = new PrintStatement(new ReadHeapExp(new VariableExpression("a")));
        IStatement s18 = new ForkStmt(new CompStatement(s16, s17));
        IStatement s19 = new PrintStatement(new VariableExpression("v"));
        IStatement s20 = new ForkStmt(new CompStatement(s15, new CompStatement(s18, s19)));
        IStatement s21 = new AssignStatement("v", new ValueExpression(new IntValue(30)));
        IStatement s22 = new PrintStatement(new VariableExpression("v"));
        IStatement s23 = new PrintStatement(new ReadHeapExp(new VariableExpression("a")));
        IStatement ex7 = new CompStatement(s12, new CompStatement(s13, new CompStatement(s14, new CompStatement(s20, new CompStatement(s21, new CompStatement(s22, s23))))));

        myIMap<String, IType> typeEnv7 = new myMap<>();
        try {
            ex7.typecheck(typeEnv7);
            ProgramState prgState7 = new ProgramState(ex7, new myStack<>(), new myMap<>(), new myList<>(), new myMap<>(), new MyHeap());
            IRepo repository7 = new Repository(prgState7, logFilePath);
            Controller ctr7 = new Controller(repository7);
            menu.addCommand(new RunExample("2", ex7.toString(), ctr7));
        } catch (Exception e) {
            System.out.println("Typecheck error for example 2: " + e.getMessage());
        }

        /*
        ProgramState prgState7 = new ProgramState(ex7, new myStack<>(), new myMap<>(), new myList<>(), new myMap<>(), new MyHeap());
        IRepo repository7 = new Repository(prgState7, logFilePath);
        Controller ctr7 = new Controller(repository7);
         */

        /*
        Example:
            string varf;
            varf = "test.in";
            open file varf;
            fork(int varc; read file(varf, varc);print(varc););
            int varc;
            read file(varf, varc);
            print(varc);
            close file(varf);
         */

        IStatement s31 = new VarDeclStatement("varf", new StringType());
        // IStatement s32 = new AssignStatement("varf", new ValueExpression(new StringValue("test.in")));
        IStatement s32 = new AssignStatement("varf", new ValueExpression(new IntValue(10)));
        IStatement s33 = new OpenRFileStmt(new VariableExpression("varf"));
        IStatement s34 = new VarDeclStatement("varc", new IntType());
        IStatement s35 = new ReadFileStmt(new VariableExpression("varf"), "varc");
        IStatement s36 = new PrintStatement(new VariableExpression("varc"));
        IStatement s37 = new ForkStmt(new CompStatement(s34, new CompStatement(s35, s36)));
        IStatement s38 = new VarDeclStatement("varc", new IntType());
        IStatement s39 = new ReadFileStmt(new VariableExpression("varf"), "varc");
        IStatement s310 = new PrintStatement(new VariableExpression("varc"));
        IStatement s311 = new CloseRFileStmt(new VariableExpression("varf"));

        IStatement ex8 = new CompStatement(s31, new CompStatement(s32, new CompStatement(s33, new CompStatement(s37, new CompStatement(s38, new CompStatement(s39, new CompStatement(s310, s311)))))));

        myIMap<String, IType> typeEnv8 = new myMap<>();
        try {
            ex8.typecheck(typeEnv8);
            ProgramState prgState8 = new ProgramState(ex8, new myStack<>(), new myMap<>(), new myList<>(), new myMap<>(), new MyHeap());
            IRepo repository8 = new Repository(prgState8, logFilePath);
            Controller ctr8 = new Controller(repository8);
            menu.addCommand(new RunExample("3", ex8.toString(), ctr8));
        } catch (Exception e) {
            System.out.println("Typecheck error for example 3: " + e.getMessage());
        }
        /*
        ProgramState prgState8 = new ProgramState(ex8, new myStack<>(), new myMap<>(), new myList<>(), new myMap<>(), new MyHeap());
        IRepo repository8 = new Repository(prgState8, logFilePath);
        Controller ctr8 = new Controller(repository8);
         */



        // TextMenu menu = new TextMenu();
        // menu.addCommand(new ExitCommand("0", "exit"));
        /*
        menu.addCommand(new RunExample("1",ex1.toString(),ctr1));
        menu.addCommand(new RunExample("2",ex2.toString(),ctr2));
        menu.addCommand(new RunExample("3",ex3.toString(),ctr3));
        menu.addCommand(new RunExample("4",ex4.toString(),ctr4));
        menu.addCommand(new RunExample("5",ex5.toString(),ctr5));
         */

        /*
        menu.addCommand(new RunExample("1", ex6.toString(), ctr6));
        menu.addCommand(new RunExample("2", ex7.toString(), ctr7));
        menu.addCommand(new RunExample("3", ex8.toString(), ctr8));
         */
        menu.show();

    }
}