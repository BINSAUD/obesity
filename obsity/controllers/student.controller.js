const User = require("../models/user.model");
const Student = require("../models/student.model");
const mongoose = require("mongoose");
const xlsx = require("xlsx");

let DB_URL =
  "mongodb+srv://ayman:lvpfh1246@cluster0.mlbuu0u.mongodb.net/obesity?retryWrites=true&w=majority";


const studentController = {};

// ---------------------- user ----------------------- //
//C
studentController.studentPageGet = (req, res, next) => {
  try {

    res.render("index", {
      userId: req.session.userId,
      isAdmin: req.session.isAdmin,
      error_createStudent: req.flash("error_createStudent"),
      success_createStudent: req.flash("success_createStudent"),
    });

  } 
  catch (error) {
    console.log(error)
    res.redirect('/')
  }
 
};
studentController.studentPagePost = (req, res, next) => {
  mongoose.connect(DB_URL, async () => {
    let { name, age, hight, weghit } = req.body;

    if (age >= 5 && age <= 19 && name && hight && weghit) {
      
      const bloc = (weghit / (hight * hight)) * 10000;
      let obesity;
      gender = req.session.gender;

      //data from excel
      const excelData = xlsx.readFile("./BMI.xlsx");
      const girlsSheet = xlsx.utils.sheet_to_json(excelData.Sheets["Girls"]);
      const boysSheet = xlsx.utils.sheet_to_json(excelData.Sheets["Boys"]);

      if (gender === "female") {
        girlsSheet.forEach((e) => {
          
          if (e.Age == age && bloc < e.SD2neg) {
            obesity = "thinnest";
            console.log("thinnest")
          } else if (e.Age == age && bloc <= e.SD1) {
            obesity = "naturalWeight";
            console.log("thinnest")
          } else if (e.Age == age && bloc <= e.SD2) {
            obesity = "overWeight";
            console.log("thinnest")
          } else if (e.Age == age && bloc > e.SD2) {
            obesity = "obesity";
            console.log("thinnest")
          }
        });
      }

      if (gender === "male") {
        boysSheet.forEach((e) => {
          if (e.Age == age && bloc < e.SD2neg) {
            obesity = "thinnest";
          } else if (e.Age == age && bloc <= e.SD1) {
            obesity = "naturalWeight";
          } else if (e.Age == age && bloc <= e.SD2) {
            obesity = "overWeight";
          } else if (e.Age == age && bloc > e.SD2) {
            obesity = "obesity";
          }
        });
      }

      try {
        const student = await new Student({
          userId: req.session.userId,
          name,
          age,
          gender,
          hight,
          weghit,
          bloc,
          obesity,
        });
        await student.save();

        req.flash("success_createStudent", "تم إضافة الطالب");
        res.redirect("/");
      } catch (error) {
        req.flash("error_createStudent", "لم يتم إضافة الطالب");
        res.redirect("/");
      }
      mongoose.disconnect(DB_URL);
    } 
    else {
      req.flash("error_createStudent", "لم يتم إضافة الطالب");
      res.redirect("/");
    }
  });
};
//R
studentController.getRecord = (req, res, next) => {
  mongoose.connect(DB_URL, async () => {
    try {
  
    const thinnest = await Student.find({ userId: req.session.userId })
      .where("obesity")
      .equals("thinnest")
      .count();
    const naturalWeight = await Student.find({ userId: req.session.userId })
      .where("obesity")
      .equals("naturalWeight")
      .count();
    const overWeight = await Student.find({ userId: req.session.userId })
      .where("obesity")
      .equals("overWeight")
      .count();
    const obesity = await Student.find({ userId: req.session.userId })
      .where("obesity")
      .equals("obesity")
      .count();
      
      const total = thinnest + naturalWeight + overWeight + obesity;
      const obesityPercent = ((obesity / total) * 100).toFixed(2);
      const thinnestPercent = ((thinnest / total) * 100).toFixed(2);

    await User.findByIdAndUpdate(req.session.userId, {
      thinnest,
      naturalWeight,
      overWeight,
      obesity,
      thinnestPercent,
      obesityPercent
    });

    mongoose.disconnect();

    res.render("schoolRecord", {
      obesityPercent,
      thinnestPercent,
      nameOfSchool : req.session.school,
      thinnest,
      naturalWeight,
      overWeight,
      obesity,
      userId: req.session.userId,
      isAdmin: req.session.isAdmin,
    });
  } 
  catch (error) 
  {
    console.log(error)
    res.redirect('/record')
  }
  });
};
studentController.studentGetUD = async (req, res, next) => {
  
    mongoose.connect(DB_URL, async () => {
      try {
      students = await Student.find({userId: req.session.userId});
      mongoose.disconnect();
      res.render("students", {
        userId: req.session.userId,
        isAdmin: req.session.isAdmin,
        students,
        success_updateStudent: req.flash("success_updateStudent"),
        success_deleteStudent: req.flash("success_deleteStudent"),
        error_updateStudent: req.flash("error_updateStudent"),
      });
    }
    catch (error) {
      console.log(error)
      res.redirect('/s')
    }
    });
};
(studentController.edit = (req, res) => {
  mongoose.connect(DB_URL, (err) => {
    const id = req.params.id;
    Student.find({userId: req.session.userId}, (err, students) => {
      if (err) {
        console.log(`there was in error : ${err}`);
        mongoose.disconnect();
      } else {
        res.render("studentEdit", {
          students,
          idTask: id,
          userId: req.session.userId,
          isAdmin: req.session.isAdmin,
        });
        mongoose.disconnect();
      }
    });
  });
}),
  (studentController.update = (req, res) => {
    mongoose.connect(DB_URL, (err) => {
      let { name, age, gender, hight, weghit } = req.body;
      if (age >= 5 && age <= 19 && name && hight && weghit) {
        const bloc = (weghit / (hight * hight)) * 10000;
        let obesity;

        //data from excel
        const excelData = xlsx.readFile("./BMI.xlsx");
        const girlsSheet = xlsx.utils.sheet_to_json(excelData.Sheets["Girls"]);
        const boysSheet = xlsx.utils.sheet_to_json(excelData.Sheets["Boys"]);

        if (gender === "female") {
          girlsSheet.forEach((e) => {
            console.log("thinnest");
            if (e.Age == age && bloc < e.SD2neg) {
              obesity = "thinnest";
              console.log("thinnest");
            } else if (e.Age == age && bloc <= e.SD1) {
              obesity = "naturalWeight";
              console.log("naturalWeight");
            } else if (e.Age == age && bloc <= e.SD2) {
              obesity = "overWeight";
              console.log("overWeight");
            } else if (e.Age == age && bloc > e.SD2) {
              obesity = "obesity";
              console.log("obesity");
            }
          });
        }

        if (gender === "male") {
          boysSheet.forEach((e) => {
            if (e.Age == age && bloc < e.SD2neg) {
              obesity = "thinnest";
            } else if (e.Age == age && bloc <= e.SD1) {
              obesity = "naturalWeight";
            } else if (e.Age == age && bloc <= e.SD2) {
              obesity = "overWeight";
            } else if (e.Age == age && bloc > e.SD2) {
              obesity = "obesity";
            }
          });
        }

        const id = req.params.id;
        Student.findByIdAndUpdate(
          id,
          {
            name,
            age,
            gender,
            hight,
            weghit,
            bloc,
            obesity,
          },
          (err, students) => {
            // if(err) return res.send(500,err);
            // else res.redirect("/");
            if (err) {
              mongoose.disconnect();
              return res.send(500, err);
            } else {
              req.flash("success_updateStudent", "تم تحديث الطالب بنجاح");
              res.redirect("/s");
              mongoose.disconnect();
            }
          }
        );
      } else {
        req.flash("error_updateStudent", "لم يتم تحديث الطالب ");
        res.redirect("/s");
        mongoose.disconnect();
      }
    });
  }),
  (studentController.delete = async (req, res) => {
    await mongoose.connect(DB_URL, async (err) => {
      try {
        let deletee = await Student.deleteOne({ id: req.params.id });
        if (deletee) {
          req.flash("success_deleteStudent", "تم حذف الطالب");
          res.redirect("/s");
          mongoose.disconnect();
        } else {
          mongoose.disconnect();
          return console.log(`there was in error : ${err}`);
        }
      } catch (error) {
        console.log(error);
        res.redirect("/s");
      }
    });
  });




// ---------------------- admin ----------------------- //
//R
studentController.schools = (req, res, next) => {
  mongoose.connect(DB_URL, async () => {
    try {
      const schools = await User.find({ isAdmin: false });
      mongoose.disconnect();
      res.render("schools", {
        schools,
        userId: req.session.userId,
        isAdmin: req.session.isAdmin,
      });
      
    } catch (error) {
      console.log(error);
      res.redirect("/schools");
    }
  });
};
//D
studentController.delateSchool = (req, res, next) => {
  mongoose.connect(DB_URL, async () => {
    try {
    const id = await req.params.id;
    const deleteSchool = await User.findByIdAndDelete(id);
    const deleteStudents = await Student.deleteMany({userId : id});
    if(deleteSchool && deleteStudents){

      req.flash("success_deleteSchool", "تم حذف المدرسة");
      res.redirect("/schools");
      mongoose.disconnect();
    }
    else{
      req.flash("success_deleteSchool", "تم حذف الطالب");
      res.redirect("/schools");
      mongoose.disconnect();
    }
    
    } catch (error) {
      console.log(error);
      res.redirect("/schools");
    }
    

  })
 
}


module.exports = studentController;
