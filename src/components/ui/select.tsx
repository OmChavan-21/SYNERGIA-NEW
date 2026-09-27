import * as React from "react"
// Since actual radix-ui select is complex to mock quickly, 
// we already used basic HTML <select> in our code where needed.
// I will just export dummy elements to satisfy the imports.

export const Select = ({ children, ...props }: any) => <div {...props}>{children}</div>
export const SelectTrigger = ({ children, ...props }: any) => <div {...props}>{children}</div>
export const SelectValue = ({ children, ...props }: any) => <span {...props}>{children}</span>
export const SelectContent = ({ children, ...props }: any) => <div {...props}>{children}</div>
export const SelectItem = ({ children, ...props }: any) => <div {...props}>{children}</div>
