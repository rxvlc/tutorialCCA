package com.ccsw.tutorial.client;

import com.ccsw.tutorial.client.model.Client;
import com.ccsw.tutorial.client.model.ClientDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ClientServiceImpl implements ClientService {
    @Autowired
    ClientRepository clientRepository;

    public Client get(Long id) {
        return clientRepository.findById(id).orElse(null);
    }

    public Client get(String name) {
        return clientRepository.findByName(name);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Client> findAll() {

        return (List<Client>) this.clientRepository.findAll();
    }

    public void save(Long id, ClientDto clientDto) throws Exception {
        Client client;
        if (id == null) {
            client = new Client();
        } else {
            client = this.get(id);
        }

        client.setName(clientDto.getName());

        if (this.get(client.getName()) != null) {
            throw new Exception("El cliente ya existe");
        }
        this.clientRepository.save(client);
    }

    @Override
    public void delete(Long id) throws Exception {
        if (this.get(id) == null) {
            throw new Exception("Not exists");
        }

        this.clientRepository.deleteById(id);
    }
}
