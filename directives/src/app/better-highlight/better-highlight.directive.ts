import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit{



  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  
  ngOnInit(): void {
   // this.renderer.setStyle(this.elRef.nativeElement, 'backgroundColor','blue')
   this.backgroundColor = this.defaultColor
  }

  @Input() defaultColor:string='transparent'
  @Input() highlightColor:string='blue' //burada girdigimiz input anatation'lari eger html sayfasinda bir atama yapmazsak
  // default ve highlight Color'lara o halde buradaki mavi ve tranparanz degerlerini aliyor.
  //ayrica alttaki satirdaki gibi Input icerisine appBetterHighlight degerini de yazarak html kod icerisinde tekrar
  //highlight color a atama yapmamiza gerek kalmiyor.
  //@Input('appBetterHighlight') highlightColor:string='blue'
  @HostBinding('style.backgroundColor')
  backgroundColor!: string; // burada iki farkli degisiklik gördük
  //1. Hostlistener ile direck backgroundColor a atama yaparak mouse'un dinledigi paragraflarda style degisikligi yaptik
  //2. ise HostBinding ile atamayi ilk olrak bu kisimda yapip degisikligi daha sonra Hostlistiner da setlemis olduk.

  @HostListener ('mouseenter') mouseover(eventdata:Event) {
    //this.renderer.setStyle(this.elRef.nativeElement, 'backgroundColor','blue')
    this.backgroundColor = this.highlightColor
  }

  @HostListener ('mouseleave') mouseleave(eventdata:Event) {
    //this.renderer.setStyle(this.elRef.nativeElement, 'backgroundColor','transparent')
    this.backgroundColor = this.defaultColor
  }

 

}
