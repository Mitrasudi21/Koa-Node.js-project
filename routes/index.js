/* eslint-disable linebreak-style */
const navigationController = require("../controllers/navigationController");
const randomController = require("../controllers/randomController");
const masterController = require("../controllers/masterController");

module.exports = (router) => {
	router.get("/", navigationController.landingPage);
	router.get("/pet-management.html", navigationController.petManagement);
	router.get("/student-management.html", navigationController.studentManagement);

	/** ***********************************************************
     * JSON API ENDPOINTS                                        *
     *************************************************************/
	router.post("/random.json", randomController.randomNumber);
	router.post("/update-pet.json", masterController.updatePet);
	router.post("/create-pet.json", masterController.createPet);
	router.post("/delete-pet.json", masterController.deletePet);
	router.post("/update-student.json", masterController.updateStudent);
	router.post("/create-student.json", masterController.createStudent);
	router.post("/delete-student.json", masterController.deleteStudent);
	router.post("/excel.json", masterController.excelData);
};
