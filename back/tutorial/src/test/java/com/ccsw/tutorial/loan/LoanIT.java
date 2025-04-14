package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.client.ClientRepository;
import com.ccsw.tutorial.client.model.Client;
import com.ccsw.tutorial.common.pagination.PageableRequest;
import com.ccsw.tutorial.config.ResponsePage;
import com.ccsw.tutorial.game.GameRepository;
import com.ccsw.tutorial.game.model.Game;
import com.ccsw.tutorial.loan.model.LoanDto;
import com.ccsw.tutorial.loan.model.LoanSearchDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class LoanIT {

    public static final String LOCALHOST = "http://localhost:";
    public static final String SERVICE_PATH = "/loan";

    public static final Long DELETE_LOAN_ID = 1L;
    public static final Long MODIFY_LOAN_ID = 3L;
    public static final int NEW_LOAN_GAME_ID = 3;
    public static final int NEW_LOAN_CLIENT_ID = 2;

    static final int TOTAL_LOANS = 5;
    static final int PAGE_SIZE = 5;

    @LocalServerPort
    int port;

    @Autowired
    TestRestTemplate restTemplate;

    @Autowired
    ClientRepository clientRepository;
    @Autowired
    GameRepository gameRepository;

    ParameterizedTypeReference<ResponsePage<LoanDto>> responseTypePage = new ParameterizedTypeReference<ResponsePage<LoanDto>>() {
    };

    @Test
    public void findFirstPageWithFiveSizeShouldReturnFirstFiveResults() {
        LoanSearchDto searchDto = new LoanSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));
        ResponseEntity<ResponsePage<LoanDto>> response = restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage);

        assertNotNull(response);
        assertEquals(TOTAL_LOANS, Objects.requireNonNull(response.getBody()).getTotalElements());
        assertEquals(PAGE_SIZE, response.getBody().getContent().size());
    }

    @Test
    public void deleteExistingLoans() {
        long newLoansSize = TOTAL_LOANS - 1;

        restTemplate.exchange(LOCALHOST + port + SERVICE_PATH + "/" + DELETE_LOAN_ID, HttpMethod.DELETE, null, Void.class);

        LoanSearchDto searchDto = new LoanSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));
        ResponseEntity<ResponsePage<LoanDto>> response = restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage);

        assertNotNull(response);
        assertEquals(newLoansSize, response.getBody().getContent().size());
    }

    @Test
    public void beginDateAfterEndDateShouldReturnError() throws Exception {

        LoanDto loanExample;
        LocalDate beginDate = LocalDate.of(2025, 11, 15);
        LocalDate endDate = LocalDate.of(2025, 11, 11);

        Optional<Client> clientOptional = clientRepository.findById(1L);
        Optional<Game> gameOptional = gameRepository.findById(1L);

        if (clientOptional.isPresent() && gameOptional.isPresent()) {
            Client client = clientOptional.get();
            Game game = gameOptional.get();
            loanExample = new LoanDto(null, endDate, beginDate, client, game);
        } else {
            throw new Exception("Cliente o juego no encontrado");
        }

        HttpEntity<LoanDto> requestEntity = new HttpEntity<>(loanExample, new HttpHeaders());

        //Debería saltar excepcion por las fechas
        restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.PUT, requestEntity, String.class);

    }

}
