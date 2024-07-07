

export function Header() {
    return (
        <div className="fixed inset-x-0 top-0 h-16" style={{backgroundColor: "#B59376",}}>

        </div>
    );
  }


export function generateRandomCode() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let randomCode = '';
for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
}
return randomCode;
}