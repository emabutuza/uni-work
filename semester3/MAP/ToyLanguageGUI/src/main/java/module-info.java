module com.example.toylanguagegui {
    requires javafx.controls;
    requires javafx.fxml;

    opens gui to javafx.fxml;
    exports gui;
}