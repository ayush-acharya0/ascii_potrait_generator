
import { useState,useRef } from "react";
const ascii_values="$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^`'. ";//from darker t0 lighter

 function Ascii_drawer(){
    const[drawing,setDrawing]=useState("");
    const canvas_ref=useRef(null); /*canvas ra uploaded image ko access paunna useRef use haneko*/
    const uploaded=useRef(null);

    const ImgGen=(e)=>{
        const file= e.target.files[0];
        if(!file || !file.type.startsWith("image/"))
            return;
        const reader = new FileReader();
        reader.onload=(event)=>{
            const img=new Image();
            img.onload=()=>{
                // image resizing
                const width=80;
                const scale=80/img.width;
                const height=Math.floor(img.height*scale*0.55);//image dherai lamo vara 0.55 le multiply garera height ghatako.
                /* width lai 80 set garda jati shrink vaxa tei respect ma height set gaeko*/

                const canvas=canvas_ref.current; /* yo chai hidden canvas ho pixel data lina lai*/
                canvas.height=height;
                canvas.width=width;
                const ctx=canvas.getContext("2d"); /* context is an interface of canvas for drawing */
                ctx.drawImage(img, 0, 0, width, height);//img is original image, (0,0)-> starting position to draw

                const {data}=ctx.getImageData(0,0,width,height);/* this returns an obj with data,width,height attributes
                                                                  and only data attribute is taken by obj destructuring.*/
                let ascii = "";
                for(let y=0;y<height;y++){
                    let line="";
                    for(let x=0;x<width;x++){
                        const offset=(y*width+x)*4;
                        const red=data[offset];
                        const green=data[offset+1];
                        const blue=data[offset+2];
                        const avg=(red+green+blue)/3 ;// its the brightness of pixel.
                        const char= ascii_values[Math.floor((avg/255)*(ascii_values.length-1))]  ;
                        /* logic: 0= black,255=white; by dividing with 255 we normalize values to 0 or 1.
                        then scale it between the array index of ascii_vlaues ie. 0 to 9.*/   
                       line += `<span style="color: rgb(${red},${green},${blue})">${char}</span>`;   
                    
                    }
                    ascii += line + "<br />";
                }
              setDrawing(ascii);}
  img.src = event.target.result;//SET THE IMAGE SOURCE TO BE DISPLAYED IN BROWSER
        }
        
        reader.readAsDataURL(file);// READ THE FILE AS A BASE X64 URL
    }  
    return(
        <>
        
         <div className="p-2 max-w-xl mx-auto ">
    <h1 className="text-2xl font-bold mb-4 text-center italic">ASCII Art Generator</h1>

    <div className="mb-4 flex flex-col items-center">
      <input
        ref={uploaded}
        type="file"
        accept="image/*"
        onChange={ImgGen}//STATE CHANGE VAYEMA
        className="file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 hover:file:cursor-pointer"
      />
    </div>
    </div>
   
    <canvas ref={canvas_ref} className="hidden" />

      <div className="h-full w-full flex justify-center">
    <div
      className="bg-black text-white text-center w-1/2 p-4 rounded-md text-xs font-mono overflow-auto leading-none"
      dangerouslySetInnerHTML={{ __html: drawing || "Upload an image to generate ASCII art." }}

      /*in react the html strings are just displayed not rendered.so to render it dangerously set inner html is used.
      ie.<b>ayush</b> here ayush will not be bold but rather the entire tag will be displayed.
      --html: is used to avoid accident.
      it shows drawing if available but display the messge if not.*/

    />
  </div>
  
        </>
    )

}
export default  Ascii_drawer;
