# To-Do List

## Resources

Attributes:

* task name (string)
* priority (string)
* assinee (string)
* completion time (string)

## Schema

```sql
CREATE TABLE todo (
    id INTEGER PRIMARY KEY,
    task TEXT,
    priority TEXT,
    assignment TEXT,
    estimate TEXT);
```

##REST ENDPOINTS

Name                        | Method | Path
----------------------------|--------|-------------------------
Retrieve todo collection    | GET    | /todo
Retrieve todo member        | GET    | /todo/*\<id\>*
Create todo member          | POST   | /todo
Update todo member          | PUT    | /todo/*\<id\>*
Delete todo member          | DELETE | /todo/*\<id\>*