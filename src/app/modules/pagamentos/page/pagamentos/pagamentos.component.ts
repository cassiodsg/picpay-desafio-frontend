import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { PagamentosInfoDto } from 'src/app/core/dtos/pagamentos-info-dto';
import { Utils } from 'src/app/core/utils/Utils';
import { CadastroComponent } from '../../components/cadastro/cadastro.component';
import { ExcluirComponent } from '../../components/excluir/excluir.component';
import { PagamentoService } from '../../service/pagamento.service';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.scss']
})
export class PagamentosComponent implements OnInit {

  public pagamentos: PagamentosInfoDto[] = [];

  constructor(
    private pagamentoService: PagamentoService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  public getAll(params?: URLSearchParams ): void {
    this.pagamentoService.getByFilter(params).pipe(map(res => res.map((item) => new PagamentosInfoDto(item)))).subscribe((res) => {
      this.pagamentos = res;
      this.pagamentos.map((res) => {
        res.value = Utils.formatMoney(res.value);
        res['hours'] = Utils.convertHour(res.date);
        res.date = Utils.convertDate(res.date);
      });
    });
  }

  public filter(value?: string): void {
    const params: URLSearchParams = new URLSearchParams();
    if (value) {
      params.append('name', value);
    }
    
    this.getAll(params);
  }

  public remover(item: PagamentosInfoDto): void {
   const modalRef = Utils.openModal(this.modalService, ExcluirComponent, 'lg');
   modalRef.componentInstance.dataSource = item;
   modalRef.result.then(result => {
    if (result) {
      this.getAll();
    }
  });
  }

  public openModal(): void {
    Utils.openModal(this.modalService, CadastroComponent, 'lg');
  }
}