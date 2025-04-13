package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.client.ClientService;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import com.ccsw.tutorial.game.GameService;
import com.ccsw.tutorial.loan.model.Loan;
import com.ccsw.tutorial.loan.model.LoanDto;
import com.ccsw.tutorial.loan.model.LoanSearchDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@Transactional
public class LoanServiceImpl implements LoanService {

    @Autowired
    LoanRepository loanRepository;
    @Autowired
    ClientService clientService;
    @Autowired
    GameService gameService;

    @Override
    public Page<Loan> findPage(LoanSearchDto dto, Long gameId, Long clientId, LocalDate filteredDate) {
        LoanSpecification gameSpec = new LoanSpecification(new SearchCriteria("game.id", ":", gameId));
        LoanSpecification clientSpec = new LoanSpecification(new SearchCriteria("client.id", ":", clientId));
        LoanSpecification beginDateSpec = new LoanSpecification(new SearchCriteria("beginDate", "<=", filteredDate));
        LoanSpecification endDateSpec = new LoanSpecification(new SearchCriteria("endDate", ">=", filteredDate));

        Specification<Loan> spec = Specification.where(gameSpec).and(clientSpec).and(beginDateSpec).and(endDateSpec);

        return this.loanRepository.findAll(spec, dto.getPageable().getPageable());
    }

    @Override
    public void save(Long id, LoanDto data) throws Exception {
        Loan loan;
        loan = new Loan();

        loan.setClient(this.clientService.get(data.getClient().getId()));
        loan.setGame(this.gameService.get(data.getGame().getId()));

        checkValidDates(data.getBeginDate(), data.getEndDate()); //check fechas validas
        checkGamesRent(loan.getClient().getId(), data.getBeginDate(), data.getEndDate()); //check el juego no esta alquilado por otro cliente
        checkGameBorrowed(loan.getGame().getId(), data.getBeginDate(), data.getEndDate());//check el cliente no tiene mas de 2 juegos alquilados

        BeanUtils.copyProperties(data, loan, "id");

        this.loanRepository.save(loan);
    }

    @Override
    public void delete(Long id) throws Exception {
        if (this.loanRepository.findById(id).orElse(null) == null) {
            throw new Exception("Not exists");
        }

        this.loanRepository.deleteById(id);
    }

    public void checkValidDates(LocalDate beginDate, LocalDate endDate) throws Exception {
        if (beginDate.isAfter(endDate)) {
            throw new Exception("Fecha de inicio posterior a fecha de fin, solicitud inválida");
        }

        int maxDays = 14;
        long daysBetweenDates = ChronoUnit.DAYS.between(beginDate, endDate);

        if (daysBetweenDates > maxDays) {
            throw new Exception("El número de días entre las fechas supera el límite permitido de " + maxDays + " días");
        }

    }

    public void checkGameBorrowed(Long gameId, LocalDate fechaIni, LocalDate fechaFin) throws Exception {
        Specification<Loan> clientLoansOnDate = new LoanSpecification(new SearchCriteria("game.id", ":", gameId)).and(new LoanSpecification(new SearchCriteria("beginDate", "<=", fechaFin)))
                .and(new LoanSpecification(new SearchCriteria("endDate", ">=", fechaIni)));

        long isLended = this.loanRepository.count(clientLoansOnDate);

        if (isLended >= 1) {
            throw new Exception("Este juego ya se encuentra en alquier.");
        }
    }

    public void checkGamesRent(Long clientId, LocalDate beginDate, LocalDate endDate) throws Exception {
        Specification<Loan> clientLoansOnDate = new LoanSpecification(new SearchCriteria("client.id", ":", clientId)).and(new LoanSpecification(new SearchCriteria("beginDate", "<=", endDate)))
                .and(new LoanSpecification(new SearchCriteria("endDate", ">=", beginDate)));

        long gamecount = this.loanRepository.count(clientLoansOnDate);
        if (gamecount >= 2) {
            throw new Exception("No es posible realizar el alquiler, el cliente ha superado el límite de juegos permitidos.");
        }
    }

}
