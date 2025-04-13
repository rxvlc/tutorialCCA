package com.ccsw.tutorial.loan.model;

import com.ccsw.tutorial.client.model.Client;
import com.ccsw.tutorial.game.model.Game;

import java.time.LocalDate;

public class LoanDto {

    Long id;
    Game game;
    Client client;
    LocalDate beginDate;
    LocalDate endDate;

    public LoanDto(Long id, LocalDate endDate, LocalDate beginDate, Client client, Game game) {
        this.id = id;
        this.endDate = endDate;
        this.beginDate = beginDate;
        this.client = client;
        this.game = game;
    }

    public LoanDto() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
