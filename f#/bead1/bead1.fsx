// SZALÓKI SÁNDOR H8L59S
type Subject (name:string, credit:int, teacher:string, mark:int) =
    member Subject.name = name
    member Subject.credit = credit
    member Subject.teacher = teacher
    member Subject.mark = mark
    override Subject.ToString() = "Tantárgy neve: " + Subject.name + ", Oktató: " + Subject.teacher + ", Kreditérték: " + Subject.credit.ToString() + ", Érdemjegy: " + Subject.mark.ToString() + "\n"

type Student (subjects: Subject list) = 
    member Student.subjects = subjects
    member private Student.NormMark(e:Subject) = e.mark
    member private Student.CredMark(e:Subject) = e.mark * e.credit
    member Student.average() = List.fold (fun acc elem -> acc + float (Student.NormMark(elem))) 0.0 Student.subjects / float Student.subjects.Length
    member Student.creditIndex() = List.fold (fun acc elem -> acc + float (Student.CredMark(elem))) 0.0 Student.subjects / 30.0

let student = Student([Subject("Elso", 2, "Valaki Elso", 5);Subject("Masodik", 4, "Valaki Masodik", 3)])
let atlag = student.average();
let credAtlag = student.creditIndex();
let targyak =  student.subjects |> List.map (fun s -> s.ToString)