import org.apache.log4j.BasicConfigurator;

import static spark.Spark.*;

//http://sparkjava.com/tutorials/
public class App {
    public static void main(String[] args) {
        BasicConfigurator.configure();
        staticFiles.location("/public");
        get("/public", (request, response) -> "It works!");
    }
}