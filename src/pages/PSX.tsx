import DocImage from "@/components/ui/DocImage";
import psxPic from "../assets/psxinstall/ps1.jpg";
import pu18_board_front from "../assets/psxinstall/pu18board_front.jpg";
import pu18_board_back from "../assets/psxinstall/pu18board_back.jpg";
import pu18boardfcircuitdia from "../assets/psxinstall/pu18board_circuit_dia_1.jpg";
import cx1 from "../assets/psxinstall/cx1.jpg";
import cx2 from "../assets/psxinstall/cx2.jpg";
import cx3 from "../assets/psxinstall/cx3.jpg";
import cx4 from "../assets/psxinstall/cx4.jpg";
import cx5 from "../assets/psxinstall/cx5.jpg";
import solderingpoints from "../assets/psxinstall/xstationboard.jpg";
import scrapepoints from "../assets/psxinstall/xstationpu18scrape.jpg";
import boardresult from "../assets/psxinstall/boardresult.jpg";
import solderAPL from "../assets/psxinstall/solderAPL.jpg";
import solderAPL2 from "../assets/psxinstall/solderAPL2.jpg";



export function PSX() {
  //return "すべてのぺーエスーエックス";

  return (
    <div className="max-w-3xl mx-auto p-6 text-left">
        <h1 className="text-3xl font-bold mb-4">手順書「てじゅんしょ」</h1>

        <DocImage src={psxPic}/>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">PS1 Xstation installation</h2>
            <p className="italic">Installing the Optical Drive emulator for dying ps1 lasers</p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">General Description</h2>
            <p>
            In this page, i will describe the process of installing the xStation for the Playstation 1.
            The Xstation is an Optical Drive Emulator for the old PS1 Hardware, as the name describes its primary
            reason is to emulate the disc drive of an ordinary console using an SD-Card to load games from.
            </p>
            <br></br>
            <p>
            It is important to note that this process is different depending on which type of board you have on your system!
            </p>
            <br></br>
            <p>    
            I did this on a PU-18 board that is commonly found in the SCPH-5500
            </p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Background</h2>
            <p>
            I wanna start by saying that i am in no way a hardware expert, i was simply bored and had a couple of consoles
            laying around and as such, i thought it would be a fun project to try my hands on.
            </p>
            <br></br>
            <p>
            The moment that clicked for me that it was doable even for an amature such as myself was when i realized how easy
            it was to bend some of the pins of the console itself (we will get into that later). That is by far the hardest part of this
            modification process. There are numerous sources out there for how to install the modchip but i thought id document my steps 
            for prosperity if for nothing else. Hopefully it helps somebody out there.
            </p>
        </section>

         <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Process</h2>

        <DocImage src={pu18_board_front}/>

        <p>We will start by looking at the front of the board</p>
        <p>The CXD2545Q as outlined in the picture is a CD Digital Signal Processor. 
            It handles a lot of the functionality of the cd drive such as laser focusing
            and drive servo.
        </p>
        <br></br>
        <p>The pins we will be lifting is:</p>
        <br></br>
        <ol className="list-disc list-inside space-y-1">
          <li>80 - allowing the xstation to handle startup / reset</li>
          <li>78 - xstation hijacking bus access</li>
          <li>77 - Serial clock - SPI bus</li>
          <li>74 - Serial IN - SPI Data from host to chip</li>
          <li>56 - Serial OUT - vice versa</li>
          <li>47 - Digital audio out</li>
          <li>46 - audio clock</li>
          <li>45 - audio frame sync</li>
        </ol>
        <br></br>
        <DocImage src={pu18boardfcircuitdia}/>
        <p>I was able to bend these carefully by using a dentist toothpick and
            carefully pulling the pins either left or right until they snap of the board.
            Be mindful of the neighboring pins as you dont wanna accidently pull one of them in the process.
            That is why its important you keep a steady hand and dont pull to hard, just right.
        </p>
        <br></br>
        <p className="italic">
            Its kind of crazy because it shouldnt
            really work but it does meaning that for some reason the soldering has weakened over time or its just susceptible
            to horizontal movement as opposed to vertical.
        </p>
        <br></br>
        <p>Either way, if you do accidently pull the other ones, its not that big of a deal because you can probably just solder it back on the board given that you didnt rip the pad with it.</p>
        <br></br>
        <p>Be sure to put some capton tape or whatever electronical tape you can find to isolate those pads since we wouldnt want those pins to accidently touch the board again.</p>
        <br></br>
        <p>You can also just snap these pins if you would like to but youll never be able to use em again, keep in mind that the point of this exercise is to disconnect these pins from the board.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <DocImage src={cx1} />
            <DocImage src={cx2} />
            <DocImage src={cx3} />
            <DocImage src={cx4} />
            <DocImage src={cx5} />
        </div>

        <p>Now the turn the board on its side and prepare to solder the psx station kit</p>
        <p>We will be focusing on the the part highlighted in red, this is where our soldering kit will go</p>
        <DocImage src={pu18_board_back}/>
        <p>I dont really have a picture of this but i found this one that basically describes all the soldering points of the board</p>
        <p>One thing to note is that we will need to scrape away some connecting points with a knife and presolder those points as the will be crucial for our installation</p>
        <p>They are highlighted in red in the diagram below</p>
        <DocImage src={solderingpoints}/>
        <DocImage src={scrapepoints}/>
        <p>Just use a knife or whatever to expose the points and start soldering them with some nice hot soldering</p>
        <p>I would also suggest to start by soldering those points first as the others will fit just nicely so start with one of the points and make sure every point aligns.</p>
        <p>If we only solder one point at first we can quickly heat it up to turn the board on an axis if we need to realign it</p>
        <p>when happy just solder away!</p>
            <DocImage src={boardresult}/>
        <p>Now we can focus on another part of the board</p>
        <p>Youll notice that big blob of solder on the AAPL up there</p>
        <p>That is this part here and its to power up this board</p>
        <DocImage src={solderAPL}/>
        <DocImage src={solderAPL2} caption="dont solder like this"/>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Result</h2>
        <ul className="list-disc list-inside">
          <li>Summarize what worked</li>
          <li>Any unexpected outcomes</li>
          <li>Whether the original goal was met</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Optional Sections</h2>
        <ul className="list-disc list-inside">
          <li><strong>Troubleshooting</strong> – Issues and how you solved them</li>
          <li><strong>Next Steps</strong> – Future improvements</li>
          <li><strong>Appendix</strong> – Diagrams, code, parts list</li>
        </ul>
      </section>
    </div>
  );

  /*
      <div>
        <br></br>
      <h2>すべてのぺーエスーエックス</h2>
        <br></br>
      <section>
        <p>
            In this page, i will describe the process of installing the xStation for the Playstation 1.
            The Xstation is an Optical Drive Emulator for the old PS1 Hardware, as the name describes its primary
            reason is to emulate the disc drive of an ordinary console using an SD-Card to load games from.
        </p>
        <br></br>
        <p>
            I wanna start by saying that i am in no way a hardware expert, i was simply bored and had a couple of consoles
            laying around and as such, i thought it would be a fun project to try my hands on. There are numerous sources
            out there for how to install the modchip but i thought id document my steps for prosperity if for nothing else...
        </p>
      </section>
    </div>
  */
}
