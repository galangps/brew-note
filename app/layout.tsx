import './globals.css';
export const metadata = { title:'Brew-Note', description:'Coffee brewing journal, recipe scaler, and personal brew lab.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
