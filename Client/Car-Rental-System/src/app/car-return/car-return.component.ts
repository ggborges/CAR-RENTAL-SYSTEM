import { Component, OnInit } from '@angular/core';
import { ParamMap, Route, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CarService, CarType } from '../car.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-car-return',
  templateUrl: './car-return.component.html',
  styleUrls: ['./car-return.component.scss']
})
export class CarReturnComponent implements OnInit {

  constructor(private route: Router,
              private carService: CarService,
              private routeActivated: ActivatedRoute,
              private formBuilder: FormBuilder) { }

  navigate_to_home_page(){
    this.route.navigate([''])
  }

  id = 0
  imagem = ''
  retirada = ''
  devolucao = ''
  retiradaData: Date = new Date();
  devolucaoData: Date = new Date();
  email = ''
  clicado = false
  pagamento = 0
  multa = false
  atrasos = ['Não atrasou', 'Atrasou menos de uma semana', 'Atrasou entre uma semana e um mês', 'Atrasou mais de um mês']
  batidos = ['Não', 'Levemente Batido', 'Moderadamente Batido', 'Fortemente Batido']
  atrasoForm = ''
  batidoForm = ''

  returnForm = this.formBuilder.group({
    atraso: '',
    batido: ''
  })

  getReturnCar(car: CarType) {
    this.imagem = car.imagem
  }

  newCar: CarType = {
    id: 0,
    marca: '',
    nome: '',
    ano: 2022,
    direcao: '',
    imagem: '',
    categoria: '',
    totAssentos: '',
    cambio: '',
    tipoCombustivel: '',
    tamanhoMala: '',
    preco: 0,
    quantidade_disponivel: 0,
    feedbacks: []
  }

  ngOnInit() {
    this.id = +this.routeActivated.snapshot.paramMap.get('id')!
    this.carService.getCarById(String(this.id)).subscribe({
      next: (car) =>{
        this.newCar = car;

        this.routeActivated.queryParams

        .subscribe(params => {
          this.email = params['email'];
          this.retirada = params['retirada'];
          this.devolucao = params['devolucao'];
          this.pagamento = Number(params['pagamento']);
        });

        this.retiradaData = new Date(this.retirada)
        this.devolucaoData = new Date(this.devolucao)

        this.getReturnCar(this.newCar)
      },
      error: () => {
        alert("deu ruim")
      }
    })

  }

  onSubmit() {
    this.atrasoForm = this.returnForm.value.atraso!
    this.batidoForm = this.returnForm.value.batido!
    console.log(this.pagamento);
    if (this.atrasoForm == this.atrasos[1]) {
      this.pagamento += 100
      this.multa = true
    }
    else if (this.atrasoForm == this.atrasos[2]) {
      this.pagamento += 300
      this.multa = true
    }
    else if (this.atrasoForm == this.atrasos[3]) {
      this.pagamento += 1000
      this.multa = true
    }

    if (this.batidoForm == this.batidos[1]) {
      this.pagamento += 300
      this.multa = true
    }
    else if (this.batidoForm == this.batidos[2]) {
      this.pagamento += 600
      this.multa = true
    }
    else if (this.batidoForm == this.batidos[3]) {
      this.pagamento += 1500
      this.multa = true
    }
    if (this.atrasoForm == '' || this.batidoForm == ''){
      alert('Preencha todas as informações!')
    }
    else{ this.clicado = true }
    console.log(this.pagamento);
    console.log(this.multa);


  }

  newCaredit: CarType = {
    id: 0,
    marca: '',
    nome: '',
    ano: 2022,
    direcao: '',
    imagem: '',
    categoria: '',
    totAssentos: '',
    cambio: '',
    tipoCombustivel: '',
    tamanhoMala: '',
    preco: 0,
    quantidade_disponivel: 0,
    feedbacks: []
  }

  editCar(car: CarType){
    return this.carService.editCar(String(car.id),
    car.nome,
    car.marca,
    car.ano,
    car.direcao,
    car.imagem,
    car.categoria,
    car.totAssentos,
    car.cambio,
    car.tipoCombustivel,
    car.tamanhoMala,
    car.preco,
    car.quantidade_disponivel + 1,
    car.feedbacks).subscribe({
      next: (message) =>{
        //this.newCar.reset()
        this.route.navigate([''])
      },
      error: () => {
        alert('Deu ruim');
      }
    })

  }

  getCarbyId(id: string){
    return this.carService.getCarById(id).subscribe({
      next: (car) =>{
        this.newCaredit = car;
        console.log(car);
        this.editCar(this.newCaredit)
      },
      error: () => {
        alert("deu ruim")
      }
    })
  }

  returnCarCheck(){
    return this.carService.returnCar(this.email, this.id, this.retiradaData, this.devolucaoData, this.pagamento).subscribe({
      next: (mensagem) =>{
        alert(mensagem.mensagem)
        this.getCarbyId(String(this.id))
      },
      error: () => {
        alert("deu ruim")
      }
    })
  }



  returnCar() {
    if (!this.clicado){
      alert('Multa ainda não calculada')
    }
    else{
      this.returnCarCheck()
    }

    }
    

}
