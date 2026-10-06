import { legalCopy, legalDocument, legalParts } from "./legal.js";

function Rich({ text }) {
  return legalParts(text).map((part, index) => {
    if (part.type === "text") return <span key={index}>{part.value}</span>;
    if (part.type === "hash") {
      return (
        <a key={index} href={part.hash}>
          {part.value}
        </a>
      );
    }
    if (part.type === "mail") {
      return (
        <a key={index} href={`mailto:${part.value}`}>
          {part.value}
        </a>
      );
    }
    return (
      <a key={index} href={part.value} target="_blank" rel="noreferrer">
        {part.value}
      </a>
    );
  });
}

export function LegalPage({ id, onBack }) {
  const copy = legalCopy.en;
  const { title, date, body } = legalDocument(copy[id]);

  return (
    <article className="doc">
      <div className="wrap doc-inner">
        <a
          className="back"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            onBack();
          }}
        >
          {copy.back}
        </a>
        <h1>{title}</h1>
        {date && <p className="doc-date">{date}</p>}
        {body.map((line, index) => (
          <p key={index}>
            <Rich text={line} />
          </p>
        ))}
      </div>
    </article>
  );
}
