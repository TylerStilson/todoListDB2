from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from urllib.parse import parse_qs
from ToDo_db import TODOdb

#TO_DO = ["dishes", "laundry"]

class MyRequestHandler(BaseHTTPRequestHandler):

    def handleNotFound(self):
        self.send_response(404)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(bytes("Not Found", "utf-8"))
    
    def handleListTODO(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        #dummy db
        db = TODOdb()
        allRecords = db.getAllTasks()
        #print(allRecords)
        self.wfile.write(bytes(json.dumps(allRecords), "utf-8"))

    def handleRetrieveTask(self, task_id):
        db = TODOdb()
        taskRecord = db.getOneTask(task_id)
        if taskRecord != None:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(taskRecord), "utf-8"))
        else:
            self.handleNotFound()

    def handleDeleteTask(self, task_id):
        db = TODOdb()
        taskRecord = db.getOneTask(task_id)

        if taskRecord != None:
            db.deleteTask(task_id)
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        else:
            self.handleNotFound()
    
    def handleUpdateTask(self, task_id):
        db=TODOdb()
        taskRecord = db.getOneTask(task_id)

        if taskRecord != None:

            length = int(self.headers["Content-Length"])
            request_body = self.rfile.read(length).decode("utf-8")
            parsed_body = parse_qs(request_body)

            task_title = parsed_body['task'][0]
            task_priority = parsed_body['priority'][0]
            task_assignment = parsed_body['assignment'][0]
            task_estimate = parsed_body['estimate'][0]

            db.updateTask(task_id, task_title, task_priority, task_assignment, task_estimate)

            self.send_response(201)
            #self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        else:
            self.handleNotFound()



    def handleCreateTodo(self):
        #step 1
        length = int(self.headers["Content-Length"])
        #step 2
    
        request_body = self.rfile.read(length).decode("utf-8")
        #step 3
        parsed_body = parse_qs(request_body)
        #step 4
        task_title = parsed_body['task'][0]
        task_priority = parsed_body['priority'][0]
        task_assignment = parsed_body['assignment'][0]
        task_estimate = parsed_body['estimate'][0]
        #TO_DO.append(task)
        #dummy db
        db = TODOdb()
        db.createTask(task_title, task_priority, task_assignment, task_estimate)

        #respond to client
        self.send_response(201)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        print("request path is:", self.path)
        path_parts = self.path.split('/')
        collection = path_parts[1]
        if len(path_parts)>2:
            member_id = path_parts[2]
        else:
            member_id = None

        if collection == "todo":
            if member_id:
                self.handleRetrieveTask(member_id)
            else:
                self.handleListTODO()
                #self.handleNotFound()
        else:
            self.handleNotFound()


    def do_PUT(self):
        path_parts = self.path.split('/')
        collection = path_parts[1]
        if len(path_parts)>2:
            member_id = path_parts[2]
        else:
            member_id = None 

        if collection == "todo":
            self.handleUpdateTask(member_id)
            
        else:
            self.handleNotFound()


    def do_DELETE(self):
        path_parts = self.path.split('/')
        collection = path_parts[1]
        if len(path_parts)>2:
            member_id = path_parts[2]
        else:
            member_id = None
        
        if collection == "todo":
            if member_id:
                self.handleDeleteTask(member_id)
            else:
                self.handleNotFound()
        else:
            self.handleNotFound()


    
    def do_POST(self):
        print("request path is:", self.path)
        if self.path == "/todo":
            self.handleCreateTodo()
        else:
            self.handleNotFound()

def main ():
    
    listen = ("127.0.0.1", 1234)
    server = HTTPServer(listen, MyRequestHandler)
    print("the server is running!")
    server.serve_forever()
    print("This will never, ever execute.")

main()

