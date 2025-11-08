package com.example.demo.controller;

import com.example.demo.capstoneservice.CapstoneService;
import com.example.demo.enumerated.CapstoneStatus;
import com.example.demo.request.CapstoneRequest;
import com.example.demo.response.CapstoneResponse;
import com.example.demo.response.GetAllCapstoneResponse;
import org.springframework.core.io.Resource;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/capstone")
public class HomeController {
    private final CapstoneService capstoneService;

    @Autowired
    public HomeController(CapstoneService capstoneService) {
        this.capstoneService = capstoneService;
    }

    //in Submit Capstone

    @PostMapping(value = "/submitCapstone", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CapstoneResponse> submitCapstone(@RequestPart CapstoneRequest capstoneRequest,
                                                           HttpSession session,
                                                           @RequestPart List<MultipartFile> pictures,
                                                           @RequestPart List<MultipartFile>  files) throws IOException {

        String email = (String) session.getAttribute("LoggedInEmail");
        return ResponseEntity.ok(capstoneService.submitCapstone(capstoneRequest, email, pictures, files));

    }
    //in Capstone Management Page
    @GetMapping("all")
    public ResponseEntity<List<GetAllCapstoneResponse>> getAllCapstone() {

        return ResponseEntity.ok(capstoneService.getAllCapstone());

    }
    @GetMapping("/view-capstone/{id}")
    public ResponseEntity<CapstoneResponse> viewCapstone(@PathVariable Long id){
        return ResponseEntity.ok(capstoneService.viewingCapstone(id));

    }
    @GetMapping("/generate-qr/{id}")
    public ResponseEntity<CapstoneResponse> generateQr(@PathVariable Long id) {
        return ResponseEntity.ok(capstoneService.viewingCapstone(id));

    }
    @DeleteMapping("/delete-capstone/{id}")
    public ResponseEntity<String> deleteCapstone(@PathVariable Long id){
        capstoneService.deleteCapstone(id);

        return ResponseEntity.ok("Capstone Deleted Successfully");
    }


    @PutMapping("/update-capstone/{id}")
    public ResponseEntity<String> updateCapstone(
            @PathVariable Long id,
            @RequestPart CapstoneRequest capstoneRequest,
            @RequestPart List<MultipartFile> pictures,
            @RequestPart List<MultipartFile> files) throws IOException {

        capstoneService.updateCapstone( capstoneRequest, id, pictures, files);
        return ResponseEntity.ok("Capstone updated successfully");
    }
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<CapstoneResponse>> getCategory(@PathVariable Long categoryId){
        List<CapstoneResponse> response = capstoneService.getAllCategory(categoryId);

        return ResponseEntity.ok(response);
 }

    @GetMapping("/category/{categoryId}/status/{status}")
    public ResponseEntity<List<CapstoneResponse>> getCategoryWithStatus(@PathVariable Long categoryId,
                                                                        @PathVariable CapstoneStatus status){
        List<CapstoneResponse> response = capstoneService.getAllCategoryAndStatus(categoryId, status);
        return ResponseEntity.ok(response);
    }


    //Getting specific Picture/File
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws MalformedURLException {

        Path filePath = Paths.get(System.getProperty("user.dir") + "/upload/pictures/").resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
    }
    @GetMapping("/softcopies/{filename}")
    public ResponseEntity<Resource> getSoftcopy(@PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get(System.getProperty("user.dir") + "/upload/softcopies/").resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(resource);
    }


}
