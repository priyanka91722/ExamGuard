import type { ReactNode } from 'react';
export function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow"><span className="eyebrow-line" />{children}</div>; }
export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) { return <><Eyebrow>{eyebrow}</Eyebrow><div className="page-top"><div><h1 className="page-title">{title}</h1><p className="page-description">{description}</p></div>{action}</div></>; }
