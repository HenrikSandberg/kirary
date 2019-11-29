import React from 'react';
import topImage from '../../resources/images/couplegardening.jpg';


export default () => (
    <div >
        <main className='main-content'>

        <img src={topImage} alt='happie people gardening'/>
        <h1>Velkommen til Kirary</h1>

            <p>Dette er en beta av et helt nytt og spennende produkt for deg som ønsker 
                å få mer ansikt i hvordan planten din har det og hvordan å bedre sikre at 
                den kan leve et langt liv.
            </p>

            <h2>Hva er Kirary</h2>

            <p>Kirary er en smart potte som lag deg monitorere og følge med på hvordan planten 
                din har det hvor som helst i verden. Tjenesten er laget for å gjøre det lettere å 
                følge med på planten din, samtidig sørge for at den for nok vann til å kunne leve et 
                langt å godt liv.</p>

            <h2>Hvordan fungerer det</h2>

            <p>
                Du setter planten din oppe oppe på opphøyningen inne i Kirary potten, deretter fyller du
                 poten med vann helt opp til bunnen av planten potte. Dette vannet blir pumpet opp til planeten 
                 din da den trenger vann. Alt du trenger å gjøre er å gå inn på dashboderet, valget hvilken 
                 plante du har og satt i Kirary potten også la potten passe på planten din. 
            </p>

            <p>Det eneste du må gjøre fra tid til annen er å fylle Kirary pottens lager med vann slik at det 
                alltid er vann som kan pumpes til planten. </p>

            <p>Du må også huske å sette inn strøm, ellers vil ikke Kirary kunne fungere.</p>

            <h2>Dashbord</h2>

            <p>Inne på dashboard siden kan du finne alt du trenger å vite om planten din. Det er her logger med 
                fuktighetene i jorden til planten, hvor mye vann det er i beholderen og hvilken temperatur det er 
                for planten din per nå. Hvis det er nok vann i beholderen, og du synes planten ser tørr ut, så kan 
                du fylle på en ekstra runde med vann. Alt du trenger å gjøre er å trykke på plantens vann knapp.</p>

            <h2>Disclamer </h2>

            <p>Denne nettsiden er for øyeblikket i Beta. Derfor er alle valg i menyer og inne på dashboard siden per 
                nå på engelsk. Dette vil kunne endre seg med tid. </p>
        </main>
        <footer className="footer">
                <div className="footer__copyright">&copy; 2019</div>
                <div className="footer__signature">Made in Norway</div>
            </footer>
    </div>
)