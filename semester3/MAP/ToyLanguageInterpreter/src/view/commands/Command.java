package view.commands;

public abstract class Command {
    private String key;
    private String description;

    protected Command(String key, String description) {
        this.key = key;
        this.description = description;
    }
    public abstract void execute();

    public String getKey(){
        return key;
    }
    public String getDescription() {
        return description;
    }
}
