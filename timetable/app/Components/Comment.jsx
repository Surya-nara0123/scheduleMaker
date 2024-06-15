'use client'
export function Comment() {
    return(
        <main className="overflow-x-auto py-6">
            <div>
                <h1>Paramters (format : <pre>[[class, course code, professor, day, slot], [class, course code, professor, day, slot], [class, course code, professor, day, slot] etc ]</pre>)</h1>
                <input type="text" placeholder="Parameters" className="p-2 rounded-lg font-mono"></input>
            </div>
        </main>
    )
}