import './globals.css';
export const metadata = {
  title:'Brew-Note v1.1',
  description:'Coffee brewing journal, recipe scaler, and personal brew lab.',
  icons:{icon:'/favicon.png',shortcut:'/favicon.png',apple:'/favicon.png'}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
