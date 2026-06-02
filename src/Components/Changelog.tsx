import { Modal } from "./Modal"
import { Button } from "./Button"
import ReactMarkdown from "react-markdown"
import {useEffect, useState} from "react"
import {Info} from "lucide-react"

export interface ChangelogProps {
    readonly program: string;
    readonly version: string;
    readonly date: string;
    readonly path: string;
}


export function Changelog({program, version, date, path}: ChangelogProps) {
    // Markdown Conmtent muss aus dem Pfad geladen werden das passiert hier im useEffect.
    const [markdownText, setMarkdownText] = useState("")

    useEffect(() => {
        let isMounted = true

        fetch(path)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Changelog konnte nicht geladen werden: ${response.statusText}`)
                }
                return response.text()
            })
            .then((data) => {
                if (isMounted) {
                    setMarkdownText(data)
                }
            })
            .catch(() => {
                if (isMounted) {
                    setMarkdownText("Changelog konnte nicht geladen werden.")
                }
            })

        return () => {
            isMounted = false
        }
    }, [path])

    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)} icon={Info} iconPosition="only" variant="ghost" size="md" />
            <Modal
                title={`${program} Changelog – ${version} – ${date}`}
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                showCloseButton={true}
                size="full"
            >
                <div className="max-h-[80vh] overflow-y-auto">
                    <ReactMarkdown>{markdownText}</ReactMarkdown>
                </div>
            </Modal>
        </>
    );
}