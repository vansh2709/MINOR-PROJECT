export default function Selector({ label, name, children }) {
    return (
        <div className="w-full flex flex-col">
            <label>{ label }</label>
            <select name={ name } className="p-2 rounded-md w-full">
                { children }
            </select>
        </div>
    )
}