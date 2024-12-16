import { useForm } from "react-hook-form";

const AddTask = ({addTasks}) => {
    const { register, handleSubmit,reset} = useForm();

    function onSubmit(data){
        addTasks(data.task);
        reset();
    }
  return (
    <div className="m-10">
      <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Add task" {...register("task")} className="border border-black p-2"/>
      <input type="submit" className="border border-black p-2"/>
      </form>
    </div>
  )
}

export default AddTask;