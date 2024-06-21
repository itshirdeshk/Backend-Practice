import sql from "mysql2"

const pool = sql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise()

export async function getNotes() {
const result = await pool.query("SELECT * FROM notes")
return result[0];
}

export async function getNote(id) {
    const result = await pool.query(`SELECT * FROM 
        notes
        where id = ?
        `, [id])
    return result[0][0]
}

export async function createNote(title, content) {
    const result = await pool.query(`INSERT INTO notes (title, contents) 
    VALUES (?, ?)`, [title, content])

    const id = result[0].insertId
    return getNote(id)
}

// // const notes = await getNotes();
// // console.log(notes);

// // const note = await getNote(1);
// // console.log(note);

// const createdNote = await createNote('Rich Dad, Poor Dad', 'A Book on Financial Education and Investing')
// console.log(createdNote);