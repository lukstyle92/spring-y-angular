import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  private cliente: Cliente = new Cliente();
  regiones: Region[];
  private titulo: string = "Crear cliente";
  private errores: string[];

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe(
          cliente => this.cliente = cliente
        )
      }
    });
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones
    });
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con éxito`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[]
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        swal.fire('Cliente Acualizado', `${json.mensaje}`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[]
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  compararRegion(o1: Region, o2: Region): boolean {
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 == null || o2 == null ? false : o1.id === o2.id;
  }

}
