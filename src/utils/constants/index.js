export const passwordSalt = Number.parseInt(process.env.PASSWORDS_SALT);
export const domain = process.env.NODE_ENV === "production" ? process.env.NEXTAUTH_URL : "http://localhost:3000";

export const generateInvitationLink = (domain, invitationId) => {
  return `${domain}/invitation/${invitationId}`;
};

export const allowedPhotosFileTypes = ["image/jpg", "image/jpeg", "image/png"];

export const generateInvitationHTMLString = (data) => {
  return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation to album</title>
            <style>
                *{
                    box-sizing: border-box;
                    font-family: Arial, Helvetica, sans-serif;
                }
        
                body{
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }
              
                .linkBtn{
                    display: block;
                    width: 120px;
                    padding: 8px;
                    background-color: #3182ce;
                    color: white !important;
                    text-align:center;
                    text-decoration: none;
        
                    border-radius: 5px;
                    font-size: 16px;
                    
                }
        
                .linkBtn:hover{
                    cursor:pointer;
                    opacity: 90%;
                    transition: ease-in-out all;
                    transition-duration: 100ms;
                }
        
        
                .invitationContainer{
                    display: flex;
                    flex-direction: column;
        
                    min-width: 360px;
                    max-width: 500px;
                }
        
            </style>
        </head>
        <body>
            <main>
                <div class="invitationContainer">
        
                    <header>
                        <h1 style="font-size:26px;">${data.author.fullname} has invited you to join the album: ${data.album.name}</h1>
                        
                    </header>
                  
                </div>
                <a href="${data.link}" class="linkBtn">Join to album</a>
            </main>
        
            <footer>
                <p style="font-size:16px;">Albumino is an app created by <a href="https://www.github.com/bkfan1" style="color: #3182ce; font-weight: bold;">Jackson Paredes Ferranti (@bkfan1)</a></p>
            </footer>
            
        </body>
        </html>`;
};
