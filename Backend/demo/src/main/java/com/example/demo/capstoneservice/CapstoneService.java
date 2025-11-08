package com.example.demo.capstoneservice;

import com.example.demo.entity.*;
import com.example.demo.enumerated.CapstoneStatus;
import com.example.demo.mapper.Mapper;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.CapstoneRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.request.CapstoneRequest;
import com.example.demo.request.StudentRequest;
import com.example.demo.response.CapstoneResponse;
import com.example.demo.response.GetAllCapstoneResponse;
import com.example.demo.util.QRCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CapstoneService {
    private final CapstoneRepository capstoneRepository;
    private final Mapper mapper;
    private final AdminRepository adminRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public CapstoneService(CapstoneRepository capstoneRepository, Mapper mapper, AdminRepository adminRepository, CategoryRepository categoryRepository) {
        this.capstoneRepository = capstoneRepository;
        this.mapper = mapper;
        this.adminRepository = adminRepository;
        this.categoryRepository = categoryRepository;

    }

    public CapstoneResponse submitCapstone(CapstoneRequest capstoneRequest,
                                           String email,
                                           List<MultipartFile> pictures,
                                           List<MultipartFile> files) throws IOException {

        if (email == null) {
            throw new RuntimeException("Not Logged in as admin");
        }
        AdminEntity admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("admin not found"));
        CategoryEntity category = categoryRepository.findById(capstoneRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("id not found"));

        CapstoneEntity capstone = mapper.toCapstoneEntity(capstoneRequest);
        capstone.setAdmin(admin);
        capstone.setCategory(category);


        // Link students to Capstone bi-directionally
        for (StudentEntity student : capstone.getStudents()) {
            student.getCapstone().add(capstone); // now student knows it belongs to this capstone
        }

// Save Capstone (students will be saved automatically)
        CapstoneEntity save = capstoneRepository.save(capstone);

        if (pictures != null && !pictures.isEmpty()) {
            List<PictureEntity> pictureEntities = new ArrayList<>();

            String uploadDir = System.getProperty("user.dir") + "/upload/pictures/";
            File directory = new File(uploadDir);
            if (!directory.exists() && !directory.mkdirs()) {
                throw new RuntimeException("Failed to create directory: " + directory.getAbsolutePath());
            }

            for (MultipartFile picture : pictures) {
                String filename = picture.getOriginalFilename();
                String filePath = uploadDir + filename;
                picture.transferTo(new File(filePath));

                PictureEntity pic = new PictureEntity();
                pic.setFileName(filename);
                pic.setFilePath(filePath);
                pic.setCapstone(capstone);

                pictureEntities.add(pic);
            }
            capstone.setPicture(pictureEntities);
        }


        if (files != null && !files.isEmpty()) {
            List<FileEntity> fileEntities = new ArrayList<>();

            String uploadDir = System.getProperty("user.dir") + "/upload/softcopies/";
            File directory = new File(uploadDir);
            if (!directory.exists() && !directory.mkdirs()) {
                throw new RuntimeException("Failed to create directory: " + directory.getAbsolutePath());
            }

            for (MultipartFile file : files) {
                String filename = file.getOriginalFilename();
                String filePath = uploadDir + filename;
                file.transferTo(new File(filePath));

                FileEntity soft = new FileEntity();
                soft.setCapstoneDigitalCopy(filename);
                soft.setFilepath(filePath);
                soft.setCapstone(capstone);

                fileEntities.add(soft);
            }
            capstone.setFiles(fileEntities);
        }


        CapstoneEntity saved = capstoneRepository.save(capstone);


        String nameCourse = saved.getStudent()
                .stream()
                .map(s -> s.getName() + " (" + s.getCourseSection() + ")")
                .reduce((a, b) -> a + ", " + b)
                .orElse("No students");

        String pic = saved.getPicture()
                .stream()
                .map(p -> p.getFileName() + " " + p.getFilePath())
                .reduce((a, b) -> a + ", " + b)
                .orElse("No pictures");

        String softcopy = saved.getFiles()
                .stream()
                .map(f -> f.getCapstoneDigitalCopy() + " " + f.getFilepath())
                .findFirst()
                .orElse("No softcopy");

        String qrData = "Capstone ID: " + saved.getId() +
                "\nTitle: " + saved.getTitle() +
                "\nYear: " + saved.getYear() +
                "\nAbstract Description: " + saved.getAbstractDescription() +
                "\nProfessor: " + saved.getProfessor() +
                "\nCategory: " + saved.getCategory().getName() +
                "\nStudents: " + nameCourse +
                "\nPictures: " + pic +
                "\nSoftCopy: " + softcopy;

        String qrCodeBase64 = QRCodeGenerator.generateQRCode(qrData, 400, 400);

        List<String> pictureUrls = saved.getPicture()
                .stream()
                .map(p -> "http://localhost:8080/api/capstone/images/" + p.getFileName())
                .toList();


        List<String> softcopyUrls = saved.getFiles()
                .stream()
                .map(f -> "http://localhost:8080/api/capstone/softcopies/" + f.getCapstoneDigitalCopy())
                .toList();

        CapstoneResponse response = mapper.toCapstoneResponse(saved);
        response.setQrCodeBase64(qrCodeBase64);
        response.setPictureUrl(pictureUrls);
        response.setSoftcopyUrl(softcopyUrls);

        return response;
    }


    public List<GetAllCapstoneResponse> getAllCapstone() {

        List<CapstoneEntity> capstones = capstoneRepository.findAll();

        return capstones.stream()
                .map(capstone-> new GetAllCapstoneResponse(
                        capstone.getId(),
                        capstone.getTitle(),
                        capstone.getCapstoneStatus(),
                        capstone.getYear()

                )).collect(Collectors.toList());
    }
    public CapstoneResponse viewingCapstone(Long id){
        CapstoneEntity capstone = capstoneRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Id with "+ id+" not found"));

        String nameCourse = capstone.getStudent()
                .stream()
                .map(s -> s.getName() + " (" + s.getCourseSection() + ")")
                .reduce((a, b) -> a + ", " + b)
                .orElse("No students");

        String pic = capstone.getPicture()
                .stream()
                .map(p -> p.getFileName() + " " + p.getFilePath())
                .reduce((a, b) -> a + ", " + b)
                .orElse("No pictures");

        String softcopy = capstone.getFiles()
                .stream()
                .map(f -> f.getCapstoneDigitalCopy() + " " + f.getFilepath())
                .findFirst()
                .orElse("No softcopy");

        String qrData = "Capstone ID: " + capstone.getId() +
                "\nTitle: " + capstone.getTitle() +
                "\nYear: " + capstone.getYear() +
                "\nAbstract Description: " + capstone.getAbstractDescription() +
                "\nStatus: " + capstone.getCapstoneStatus() +
                "\nProfessor: " + capstone.getProfessor() +
                "\nCategory: " + capstone.getCategory().getName() +
                "\nStudents: " + nameCourse +
                "\nPictures: " + pic +
                "\nSoftCopy: " + softcopy;

        String qrCodeBase64 = QRCodeGenerator.generateQRCode(qrData, 400, 400);

        List<String> pictureUrls = capstone.getPicture()
                .stream()
                .map(p -> "http://localhost:8080/api/capstone/images/" + p.getFileName())
                .toList();


        List<String> softcopyUrls = capstone.getFiles()
                .stream()
                .map(f -> "http://localhost:8080/api/capstone/softcopies/" + f.getCapstoneDigitalCopy())
                .toList();

        CapstoneResponse response = mapper.toCapstoneResponse(capstone);
        response.setPictureUrl(pictureUrls);
        response.setSoftcopyUrl(softcopyUrls);
        response.setQrCodeBase64(qrCodeBase64);

        return response;
    }

    public void deleteCapstone(Long id) {
        CapstoneEntity capstone = capstoneRepository.findById(id)
                .orElseThrow(()->new RuntimeException("no capstone found"));

        capstoneRepository.delete(capstone);
    }

    public void updateCapstone(CapstoneRequest capstoneRequest,
                               Long id,
                               List<MultipartFile> pictures,
                               List<MultipartFile> files) throws IOException {

        CapstoneEntity capstone = capstoneRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Capstone not found with ID: " + id));

        capstone.setTitle(capstoneRequest.getTitle());
        capstone.setYear(capstoneRequest.getYear());
        capstone.setAbstractDescription(capstoneRequest.getAbstractDescription());
        capstone.setProfessor(capstoneRequest.getProfessor());
        capstone.setCapstoneStatus(capstoneRequest.getCapstoneStatus());

        CategoryEntity category = categoryRepository.findById(capstoneRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + capstoneRequest.getCategoryId()));

        capstone.setCategory(category);

        List<StudentEntity> students = capstoneRequest.getStudents()
                        .stream().map(studentreq ->{
                            StudentEntity student = new StudentEntity();
                            student.setName(studentreq.getName());
                            student.setEmail(studentreq.getEmail());
                            student.setCourseSection(studentreq.getCourseSection());
                            return student;
                }).collect(Collectors.toList());

        capstone.setStudents(students);


        if (files != null && !files.isEmpty()) {
            if (capstone.getFiles() != null) {
                for (FileEntity oldFile : capstone.getFiles()) {
                    File existingFile = new File(oldFile.getFilepath());
                    if (existingFile.exists()) existingFile.delete();
                }
                capstone.getFiles().clear();
            }

            List<FileEntity> fileEntities = new ArrayList<>();
            String uploadDir = System.getProperty("user.dir") + "/upload/softcopies/";
            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            for (MultipartFile file : files) {
                String filename = file.getOriginalFilename();
                String filePath = uploadDir + filename;
                file.transferTo(new File(filePath));

                FileEntity soft = new FileEntity();
                soft.setCapstoneDigitalCopy(filename);
                soft.setFilepath(filePath);

                soft.setCapstone(capstone);
                fileEntities.add(soft);
            }

            capstone.setFiles(fileEntities);
        }

        if (pictures != null && !pictures.isEmpty()) {
            if (capstone.getPicture() != null) {

                for (PictureEntity oldPic : capstone.getPicture()) {
                    File existingPic = new File(oldPic.getFilePath());
                    if (existingPic.exists()) existingPic.delete();
                }
                capstone.getPicture().clear();
            }

            List<PictureEntity> pictureEntities = new ArrayList<>();
            String uploadDir = System.getProperty("user.dir") + "/upload/pictures/";
            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            for (MultipartFile picture : pictures) {
                String filename = picture.getOriginalFilename();
                String filepath = uploadDir + filename;
                picture.transferTo(new File(filepath));

                PictureEntity pictureEntity = new PictureEntity();
                pictureEntity.setFileName(filename);
                pictureEntity.setFilePath(filepath);
                pictureEntity.setCapstone(capstone);
                pictureEntities.add(pictureEntity);
            }

            capstone.setPicture(pictureEntities);
        }

            capstoneRepository.save(capstone);
    }

    public List<CapstoneResponse> getAllCategory(Long categoryId) {

        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new RuntimeException("category with id " + categoryId + " not found"));

        List<CapstoneEntity> capstones = capstoneRepository.findAllByCategory(category);

        return capstones.stream()
                .map(mapper::toCapstoneResponse)
                .toList();
    }

    public List<CapstoneResponse> getAllCategoryAndStatus(Long categoryId, CapstoneStatus status) {

        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new RuntimeException("category with id " + categoryId + " not found"));

        List<CapstoneEntity> capstones = capstoneRepository.findByCategoryAndCapstoneStatus(category, status);

        return capstones.stream()
                .map(mapper::toCapstoneResponse)
                .toList();
    }
}